const redis = require('redis');
const { reservationInventory } = require('../model/repository/inventory.repo');

// Upstash dùng rediss:// → bắt buộc phải config tls
const client = redis.createClient({
  url: 'rediss://default_ro:Ai7mAAIgcDIfWx9H9krkLGHXa0DcCYLuVRGMJ9YXoCltJWHb3Vxd3w@neutral-akita-12006.upstash.io:6379',
  // Upstash không cần thêm config gì đặc biệt, nhưng nên có retry strategy
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Quan trọng: phải await client.connect() hoặc xử lý sẵn
const connectRedis =  async() => {
   await client.connect();
}

// Nếu bạn dùng ioredis thì tốt hơn cho Upstash, nhưng redis@4 cũng ok nếu sửa đúng

const ACQUIRE_LOCK_SCRIPT = `
  if redis.call('EXISTS', KEYS[1]) == 0 then
    return redis.call('SET', KEYS[1], ARGV[1], 'PX', ARGV[2], 'NX')
  else
    return nil
  end
`;

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const value = cartId;                 // giá trị lock phải unique theo request
  const ttl = 10000;                    // 10s lock (tăng lên, 3s quá ngắn dễ fail)
  const retryTimes = 10;
  const retryDelay = 200;               // tăng delay lên, 50ms quá gấp → phí request Upstash

  for (let i = 0; i < retryTimes; i++) {
    // Dùng EVAL thay vì SET NX để tránh race condition nhỏ
    const result = await client.eval(
      ACQUIRE_LOCK_SCRIPT,
      1,           // số key = 1
      key,         // KEYS[1]
      value,       // ARGV[1]
      ttl          // ARGV[2]
    );

    if (result === 'OK') {
      console.log(`Lock acquired: ${key}`);

      try {
        const isReservation = await reservationInventory({
          productId,
          quantity,
          cartId,
        });

        if (isReservation.modifiedCount) {
          return key;                 // thành công → trả về key để release sau
        } else {
          // Đặt hàng thất bại (hết hàng) → thả lock ngay
          await releaseLock(key, value);
          return null;
        }
      } catch (error) {
        // Lỗi bất ngờ → phải thả lock
        console.error('Error in reservation:', error);
        await releaseLock(key, value);
        throw error;
      }
    }

    // Chờ trước khi thử lại
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
  }

  // Sau 10 lần vẫn không lock được
  console.log(`Cannot acquire lock for ${key} after ${retryTimes} retries`);
  return null;
};

const releaseLock = async (key, value) => {
  const RELEASE_SCRIPT = `
    if redis.call('GET', KEYS[1]) == ARGV[1] then
      return redis.call('DEL', KEYS[1])
    else
      return 0
    end
  `;

  try {
    const result = await client.eval(RELEASE_SCRIPT, 1, key, value);
    if (result === 1) {
      console.log(`Lock released: ${key}`);
    }
    // nếu result === 0 → lock đã hết hạn hoặc bị người khác lấy → không sao cả
  } catch (err) {
    console.error('Error releasing lock:', err);
  }
};

module.exports = {
  acquireLock,
  releaseLock,
  client,
  connectRedis
};