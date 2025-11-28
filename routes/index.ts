import express from "express";
import commentRoutes from "./comment";
import inventoryRoutes from "./inventory";
import checkoutRoutes from "./checkout";
import cartRoutes from "./cart";
import discountRoutes from "./discount";
import productRoutes from "./product";
import accessRoutes from "./access";

const router = express.Router();

router.use("/api/v1/comment", commentRoutes);
router.use("/api/v1/inventory", inventoryRoutes);
router.use("/api/v1/checkout", checkoutRoutes);
router.use("/api/v1/cart", cartRoutes);
router.use("/api/v1/discount", discountRoutes);
router.use("/api/v1/product", productRoutes);
router.use("/api/v1", accessRoutes);

export default router;
