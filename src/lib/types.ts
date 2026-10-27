export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface PersonalisationOption {
  id: string;
  title: string;
  allowRecipientName: boolean;
  allowCustomMessage: boolean;
  allowGiftCard: boolean;
  allowPhotoUpload: boolean;
  allowGiftWrap: boolean;
  giftWrapPrice: number;
  availableColors?: string | null;
  additionalPrice: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications?: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number | null;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  occasion: string;
  giftType?: string | null;
  rating: number;
  reviewCount: number;
  tags?: string | null;
  categoryId?: string | null;
  category?: Category | null;
  images: ProductImage[];
  personalisationOptions?: PersonalisationOption[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface HamperBox {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  dimensions?: string | null;
  capacity?: string | null;
  image: string;
  isAvailable: boolean;
  displayOrder: number;
}

export interface CustomHamperProductItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  selectedVariant?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
}

export interface CustomHamperExtra {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CustomHamperPersonalisation {
  senderName?: string;
  recipientName?: string;
  cardMessage?: string;
  personalMessage?: string;
  greetingCard?: string;
  giftWrap?: string;
  wrappingTheme?: string;
  wrappingPrice?: number;
  ribbonColor: string;
  occasion: string;
  extras?: CustomHamperExtra[];
  extrasTotal?: number;
  subtotal?: number;
  boxPrice?: number;
  customisationTotal?: number;
  totalPrice?: number;
}

export interface CustomHamperPayload {
  box: HamperBox;
  items: CustomHamperProductItem[];
  personalisation: CustomHamperPersonalisation;
  boxPrice: number;
  itemsPrice: number;
  customisationPrice: number;
  totalPrice: number;
}

export interface CartItemPersonalisation {
  recipientName?: string;
  customMessage?: string;
  giftCardMessage?: string;
  customPhotoUrl?: string;
  chosenColor?: string;
  giftWrap?: boolean;
  giftWrapTheme?: string;
}

export interface CartItem {
  id: string; // Unique cart line item ID
  productId: string;
  product: Product;
  quantity: number;
  personalisation?: CartItemPersonalisation;
  isCustomHamper?: boolean;
  customHamper?: CustomHamperPayload;
  unitPrice: number;
  totalPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  recipientName?: string | null;
  customMessage?: string | null;
  giftCardMessage?: string | null;
  customPhotoUrl?: string | null;
  chosenColor?: string | null;
  customDetails?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string | null;
  deliveryMethod: string;
  estimatedDelivery?: string | null;
  giftMessage?: string | null;
  giftWrap: boolean;
  giftWrapTheme?: string | null;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentTransactionId?: string | null;
  fulfilmentStatus:
    | "ORDER_PLACED"
    | "PAYMENT_CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  customerPhoto?: string | null;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
  addresses: UserAddress[];
  wishlistIds: string[];
}

export interface UserAddress {
  id: string;
  fullName: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  isDefault: boolean;
  instructions?: string | null;
}
