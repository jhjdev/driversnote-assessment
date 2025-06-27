import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Receipt } from '../../types/types';
import { mongodbService } from '../../services/mongodb.service';

// Define Receipt interface if not in types
export interface ReceiptData {
  id: string;
  userId: number;
  userName: string;
  beacons: number;
  unitPrice: number;
  basePrice: number;
  discount: number;
  totalPrice: number;
  discountApplied: boolean;
  items: string[];
  date: string;
  deliveryAddress: {
    name: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

// Async thunks
export const fetchReceipts = createAsyncThunk(
  'receipts/fetchReceipts',
  async (_, { rejectWithValue }) => {
    try {
      const receipts = await mongodbService.getReceipts();
      return receipts;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch receipts');
    }
  },
);

export const createReceipt = createAsyncThunk(
  'receipts/createReceipt',
  async (receiptData: Omit<Receipt, 'id' | 'timestamp'>, { rejectWithValue }) => {
    try {
      const newReceipt = await mongodbService.createReceipt(receiptData);
      return newReceipt;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create receipt');
    }
  },
);

export const deleteReceipt = createAsyncThunk(
  'receipts/deleteReceipt',
  async (receiptId: string, { rejectWithValue }) => {
    try {
      await mongodbService.deleteReceipt(receiptId);
      return receiptId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete receipt');
    }
  },
);

// State interface
export interface ReceiptsState {
  receipts: ReceiptData[];
  loading: boolean;
  error: string | null;
}

const initialState: ReceiptsState = {
  receipts: [],
  loading: false,
  error: null,
};

// Slice
const receiptsSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addMockReceipts: (state) => {
      // Add some mock receipts for demonstration
      const mockReceipts: ReceiptData[] = [
        {
          id: 'receipt_1',
          userId: 1,
          userName: 'John Doe',
          beacons: 3,
          unitPrice: 10.0,
          basePrice: 30.0,
          discount: 0,
          totalPrice: 30.0,
          discountApplied: false,
          items: ['3x Beacon Devices'],
          date: '2024-01-15T10:30:00.000Z',
          deliveryAddress: {
            name: 'John Doe',
            address: '123 Main St',
            postalCode: '12345',
            city: 'New York',
            country: 'USA',
          },
        },
        {
          id: 'receipt_2',
          userId: 2,
          userName: 'Jane Smith',
          beacons: 6,
          unitPrice: 10.0,
          basePrice: 60.0,
          discount: 9.0,
          totalPrice: 51.0,
          discountApplied: true,
          items: ['6x Beacon Devices'],
          date: '2024-01-14T14:20:00.000Z',
          deliveryAddress: {
            name: 'Jane Smith',
            address: '456 Oak Ave',
            address2: 'Apt 2B',
            postalCode: '67890',
            city: 'Los Angeles',
            country: 'USA',
          },
        },
      ];
      state.receipts = mockReceipts;
    },
  },
  extraReducers: (builder) => {
    // Fetch Receipts
    builder
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        // Convert Receipt[] to ReceiptData[] format for compatibility
        state.receipts = action.payload.map(receipt => ({
          id: receipt.id,
          userId: receipt.userId,
          userName: receipt.userName,
          beacons: receipt.beaconQuantity,
          unitPrice: 10.0, // Default unit price
          basePrice: receipt.totalPrice + (receipt.discount || 0),
          discount: receipt.discount || 0,
          totalPrice: receipt.totalPrice,
          discountApplied: (receipt.discount || 0) > 0,
          items: [`${receipt.beaconQuantity}x Beacon Devices`],
          date: receipt.timestamp,
          deliveryAddress: {
            name: receipt.userName,
            address: receipt.deliveryAddress,
            postalCode: '00000',
            city: 'Unknown',
            country: 'Unknown',
          },
        }));
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Receipt
    builder
      .addCase(createReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReceipt.fulfilled, (state, action) => {
        state.loading = false;
        // Convert Receipt to ReceiptData format
        const receipt = action.payload;
        const receiptData: ReceiptData = {
          id: receipt.id,
          userId: receipt.userId,
          userName: receipt.userName,
          beacons: receipt.beaconQuantity,
          unitPrice: 10.0,
          basePrice: receipt.totalPrice + (receipt.discount || 0),
          discount: receipt.discount || 0,
          totalPrice: receipt.totalPrice,
          discountApplied: (receipt.discount || 0) > 0,
          items: [`${receipt.beaconQuantity}x Beacon Devices`],
          date: receipt.timestamp,
          deliveryAddress: {
            name: receipt.userName,
            address: receipt.deliveryAddress,
            postalCode: '00000',
            city: 'Unknown',
            country: 'Unknown',
          },
        };
        state.receipts.unshift(receiptData); // Add to beginning
      })
      .addCase(createReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Receipt
    builder
      .addCase(deleteReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = state.receipts.filter(receipt => receipt.id !== action.payload);
      })
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addMockReceipts } = receiptsSlice.actions;
export default receiptsSlice.reducer;
