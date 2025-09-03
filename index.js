import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

const prisma = new PrismaClient();

const app = express();

// Middleware
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.json("test is working.");
});

// Retrieve all coupons.
app.get("/coupons", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany();
    if (!coupons) {
      res.status(401).json("No coup0ns found.");
    }
    res.status(201).json(coupons);
  } catch (err) {
    res.status(500).json("Error While retrieving coupons");
  }
});

// GET /coupons/:id
app.get("/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) }, // convert to number if id is Int in schema
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json(coupon);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong while getting coupons..." });
  }
});

// POST /coupons - create product-wise coupon
app.post("/coupons", async (req, res) => {
  const { type, details } = req.body;

  if (type !== "product-wise") {
    return res
      .status(400)
      .json({ error: "Only product-wise coupons supported" });
  }

  if (!details || !details.product_id || typeof details.discount !== "number") {
    return res.status(400).json({ error: "Invalid coupon details" });
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        type,
        productid: details.product_id,
        discount: details.discount,
      },
    });
    res.status(201).json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while creating coupon" });
  }
});

// PUT /coupons/:id - update coupon by ID
app.put("/coupons/:id", async (req, res) => {
  console.log("Hellloooooo");

  try {
    const { id } = req.params;
    const { product_id, discount } = req.body; // fields to update
    console.log(id, product_id, discount);
    if (!product_id || !discount) {
      return res.status(400).json({ error: "Invalid cart" });
    }
    const updatedCoupon = await prisma.coupon.update({
      where: { id: parseInt(id, 10) },
      data: {
        productid: product_id,
        discount: discount,
      },
    });

    res.json(updatedCoupon);
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma error: record not found
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(500).json({ error: "Failed to update coupon" });
  }
});

// DELETE /coupons/:id - delete a coupon by ID
app.delete("/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await prisma.coupon.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: "Coupon deleted successfully", deletedCoupon });
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma error: record not found
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(500).json({ error: "Failed to delete coupon" });
  }
});

// POST /applicable-coupons - check applicable coupons for cart
app.post("/applicable-coupons", async (req, res) => {
  const { cart } = req.body;
  if (!cart || !cart.items) {
    return res.status(400).json({ error: "Invalid cart" });
  }

  const productIds = cart.items.map((item) => item.productId);

  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        type: "product-wise",
        productid: { in: productIds },
      },
    });

    const applicableCoupons = coupons
      .map((coupon) => {
        const item = cart.items.find((i) => i.productId === coupon.productid);
        if (!item) return null;
        const discount = item.price * item.quantity * (coupon.discount / 100);
        return {
          coupon_id: coupon.id,
          type: coupon.type,
          discount,
          on_product_id: item.id,
        };
      })
      .filter(Boolean);

    res.json({ applicable_coupons: applicableCoupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching applicable coupons" });
  }
});

// POST /apply-coupon/:id - apply coupon to cart
app.post("/apply-coupon/:id", async (req, res) => {
  const couponId = parseInt(req.params.id);
  const { cart } = req.body;

  if (!cart || !cart.items) {
    return res.status(400).json({ error: "Invalid cart" });
  }

  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    if (coupon.type !== "product-wise") {
      return res
        .status(400)
        .json({ error: "Only product-wise coupons supported" });
    }

    let totalDiscount = 0;
    const updatedItems = cart.items.map((item) => {
      if (item.product_id === coupon.productid) {
        const discount = item.price * item.quantity * (coupon.discount / 100);
        totalDiscount += discount;
        return { ...item, total_discount: discount };
      }
      return { ...item, total_discount: 0 };
    });

    const totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const finalPrice = totalPrice - totalDiscount;

    res.json({
      updated_cart: {
        items: updatedItems,
        total_price: totalPrice,
        total_discount: totalDiscount,
        final_price: finalPrice,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error applying coupon" });
  }
});

// Start server
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
