// Occasion-driven template configuration for registries

export type OccasionType = "wedding" | "baby_shower" | "housewarming" | "birthday" | "anniversary" | "other";

export interface CashFundTemplate {
  name: string;
  description: string;
}

export interface OccasionTemplate {
  title: string;
  titlePlaceholder: string;
  headerImage: string;
  personalMessage: string;
  thankYouNote: string;
  cashFunds: CashFundTemplate[];
}

export const occasionTemplates: Record<OccasionType, OccasionTemplate> = {
  wedding: {
    title: "Our Wedding Registry",
    titlePlaceholder: "Sarah & John's Wedding Registry",
    headerImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop",
    personalMessage: "We're so excited to begin this new chapter together! Thank you for being part of our special day.",
    thankYouNote: "Thank you for your love and generosity. Your thoughtful gift means the world to us!",
    cashFunds: [
      { name: "Honeymoon Fund", description: "Help us create unforgettable memories on our dream honeymoon" },
      { name: "New Home Fund", description: "Contribute to our nest egg as we build our home together" },
      { name: "Date Night Fund", description: "Help us keep the romance alive with special date nights" },
    ],
  },
  baby_shower: {
    title: "Baby Shower Registry",
    titlePlaceholder: "Baby [Name]'s Registry",
    headerImage: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=600&fit=crop",
    personalMessage: "We're overjoyed to welcome our little one! Thank you for showering us with love.",
    thankYouNote: "Thank you for your wonderful gift. We can't wait for baby to enjoy it!",
    cashFunds: [
      { name: "Baby Essentials", description: "Help us stock up on all the baby necessities" },
      { name: "Nursery Fund", description: "Contribute to creating a beautiful space for our little one" },
      { name: "Education Fund", description: "Help us save for our baby's future education" },
    ],
  },
  housewarming: {
    title: "House Warming Registry",
    titlePlaceholder: "Our New Home Registry",
    headerImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop",
    personalMessage: "We're so excited to finally have a place to call home! Join us in making it special.",
    thankYouNote: "Thank you for helping make our house a home. Your gift is truly appreciated!",
    cashFunds: [
      { name: "Home Improvement", description: "Help us with renovations and upgrades" },
      { name: "Furniture Fund", description: "Contribute to furnishing our new space" },
      { name: "Garden & Outdoor", description: "Help us create a beautiful outdoor space" },
    ],
  },
  birthday: {
    title: "Birthday Wishlist",
    titlePlaceholder: "[Name]'s Birthday Wishlist",
    headerImage: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&h=600&fit=crop",
    personalMessage: "It's time to celebrate another trip around the sun! Thank you for making my day special.",
    thankYouNote: "Thank you so much for the birthday love! Your gift made my day extra special!",
    cashFunds: [
      { name: "Experience Fund", description: "Help me create amazing memories with new experiences" },
      { name: "Hobby Fund", description: "Contribute to my favorite hobbies and interests" },
    ],
  },
  anniversary: {
    title: "Anniversary Registry",
    titlePlaceholder: "Our Anniversary Registry",
    headerImage: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&h=600&fit=crop",
    personalMessage: "Celebrating another beautiful year together! Thank you for sharing in our joy.",
    thankYouNote: "Thank you for celebrating this milestone with us. Your gift means so much!",
    cashFunds: [
      { name: "Celebration Fund", description: "Help us celebrate this special milestone" },
      { name: "Travel Fund", description: "Contribute to our anniversary getaway" },
    ],
  },
  other: {
    title: "Gift Registry",
    titlePlaceholder: "My Gift Registry",
    headerImage: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=600&fit=crop",
    personalMessage: "Thank you for being part of this celebration with us!",
    thankYouNote: "Thank you for your thoughtful gift. We truly appreciate your generosity!",
    cashFunds: [
      { name: "Celebration Fund", description: "Contribute to making this celebration special" },
    ],
  },
};

export const occasionLabels: Record<OccasionType, string> = {
  wedding: "Wedding",
  baby_shower: "Baby Shower",
  housewarming: "House Warming",
  birthday: "Birthday",
  anniversary: "Anniversary",
  other: "Other",
};

export const occasionIcons: Record<OccasionType, string> = {
  wedding: "💍",
  baby_shower: "👶",
  housewarming: "🏠",
  birthday: "🎂",
  anniversary: "💍",
  other: "🎁",
};
