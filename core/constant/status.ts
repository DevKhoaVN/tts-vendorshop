export const statusCode = {
    OK: 200,
    CREATED: 201
} as const;

export const reasonStatusCode: Record<number, string> = {
    200: "OK",
    201: "CREATED"
};

