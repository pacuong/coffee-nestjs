import {
  PrismaClient,
  Role,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  User,
  Category,
  Product,
  ProductVariant,
  Ingredient,
  Topping,
  Recipe,
  Cart,
  CartItem,
  Order,
  OrderItem,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categoryImages = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0',
];

const productImages = [
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
  'https://images.unsplash.com/photo-1507914372368-b2b085b925a1',
];

const ingredientImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'https://images.unsplash.com/photo-1542838132-92c53300491e',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
];

const toppingImages = [
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777',
  'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd',
];

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  await prisma.orderItemTopping.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItemTopping.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.recipeItem.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // USERS
  const users: User[] = [];

  for (let i = 0; i < 100; i++) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const u = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@mail.com`,
        password: hashedPassword,
        role: i === 0 ? Role.ADMIN : Role.CUSTOMER,
      },
    });

    users.push(u);
  }

  // CATEGORIES
  const categories: Category[] = [];

  for (let i = 0; i < 100; i++) {
    const c = await prisma.category.create({
      data: {
        name: `Category ${i}`,
        slug: `category-${i}`,
        image: rand(categoryImages),
        imagePublicId: `seed-category-${i}`,
      },
    });
    categories.push(c);
  }

  // PRODUCTS
  const products: Product[] = [];
  for (let i = 0; i < 100; i++) {
    const p = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        categoryId: rand(categories).id,
        image: rand(productImages),
        imagePublicId: `seed-product-${i}`,
        description: `Description Product ${i}`,
      },
    });
    products.push(p);
  }

  // VARIANTS
  const variants: ProductVariant[] = [];
  for (let i = 0; i < 100; i++) {
    const v = await prisma.productVariant.create({
      data: {
        name: `Variant ${i}`,
        price: 10000,
        productId: rand(products).id,
      },
    });
    variants.push(v);
  }

  // INGREDIENTS
  const ingredients: Ingredient[] = [];
  for (let i = 0; i < 100; i++) {
    const ing = await prisma.ingredient.create({
      data: {
        name: `Ingredient ${i}`,
        unit: 'g',
        image: rand(ingredientImages),
        imagePublicId: `seed-ingredient-${i}`,
      },
    });
    ingredients.push(ing);
  }

  // INVENTORY
  for (let i = 0; i < 100; i++) {
    await prisma.inventory.create({
      data: {
        ingredientId: ingredients[i].id,
        quantity: 1000,
      },
    });
  }

  // TOPPINGS
  const toppings: Topping[] = [];
  for (let i = 0; i < 100; i++) {
    const t = await prisma.topping.create({
      data: {
        name: `Topping ${i}`,
        price: 5000,
        image: rand(toppingImages),
        imagePublicId: `seed-topping-${i}`,
      },
    });
    toppings.push(t);
  }

  // RECIPES + RECIPE ITEMS
  const recipes: Recipe[] = [];
  for (let i = 0; i < 100; i++) {
    const r = await prisma.recipe.create({
      data: {
        variantId: variants[i].id,
      },
    });

    recipes.push(r);

    await prisma.recipeItem.create({
      data: {
        recipeId: r.id,
        ingredientId: rand(ingredients).id,
        quantity: 1,
      },
    });
  }

  // CARTS
  const carts: Cart[] = [];
  for (let i = 0; i < 100; i++) {
    const c = await prisma.cart.create({
      data: {
        userId: users[i].id,
      },
    });
    carts.push(c);
  }

  // CART ITEMS
  const cartItems: CartItem[] = [];
  for (let i = 0; i < 100; i++) {
    const ci = await prisma.cartItem.create({
      data: {
        cartId: carts[i].id,
        variantId: rand(variants).id,
        quantity: 1,
      },
    });
    cartItems.push(ci);
  }

  // CART ITEM TOPPINGS
  for (let i = 0; i < 100; i++) {
    await prisma.cartItemTopping.create({
      data: {
        cartItemId: cartItems[i].id,
        toppingId: rand(toppings).id,
        quantity: 1,
      },
    });
  }

  // ORDERS
  const orders: Order[] = [];
  for (let i = 0; i < 100; i++) {
    const o = await prisma.order.create({
      data: {
        userId: users[i].id,
        totalAmount: 100000,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PAID,
      },
    });
    orders.push(o);
  }

  // ORDER ITEMS
  const orderItems: OrderItem[] = [];
  for (let i = 0; i < 100; i++) {
    const oi = await prisma.orderItem.create({
      data: {
        orderId: orders[i].id,
        variantId: rand(variants).id,
        quantity: 1,
        price: 10000,
      },
    });
    orderItems.push(oi);
  }

  // ORDER ITEM TOPPINGS
  for (let i = 0; i < 100; i++) {
    await prisma.orderItemTopping.create({
      data: {
        orderItemId: orderItems[i].id,
        toppingId: rand(toppings).id,
        quantity: 1,
      },
    });
  }

  // PAYMENTS
  for (let i = 0; i < 100; i++) {
    await prisma.payment.create({
      data: {
        orderId: orders[i].id,
        amount: 100000,
        status: PaymentStatus.PAID,
        transactionId: `tx-${i}`,
      },
    });
  }

  // NOTIFICATIONS
  for (let i = 0; i < 100; i++) {
    await prisma.notification.create({
      data: {
        userId: users[i].id,
        title: `Notification ${i}`,
        message: `Message ${i}`,
      },
    });
  }

  console.log('Seed done');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
