export interface FavoriteItem {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: Array<{ url: string }>;
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
  };
}

export interface FavoritesState {
  favorites: FavoriteItem[];
  loading: boolean;
  error: string | null;
}
