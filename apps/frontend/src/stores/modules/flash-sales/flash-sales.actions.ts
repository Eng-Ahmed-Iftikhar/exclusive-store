import { IFlashSales } from ".";
import { flashSalesApi } from "../../apis/flash-sales.api";

export async function getActiveFlashSales(): Promise<IFlashSales.FlashSale[]> {
  try {
    const response = await flashSalesApi.getActiveFlashSales();
  return response
  } catch (err) {
    throw new Error('Failed to fetch active flash sales');
  }
}

export async function getFlashSaleById(id: string): Promise<IFlashSales.FlashSale> {
  try {
    const response = await flashSalesApi.getFlashSaleById(id);
    return response
  } catch (err) {
    throw new Error('Failed to fetch flash sale');
  }
}

export async function getFlashSaleItems(flashSaleId: string): Promise<IFlashSales.FlashSaleItem[]> {
  try {
    // Since getFlashSaleItems doesn't exist in the API, we'll get the flash sale and return its items
    const flashSale = await flashSalesApi.getFlashSaleById(flashSaleId);
    return flashSale.items || [];
  } catch (err) {
    throw new Error('Failed to fetch flash sale items');
  }
}
