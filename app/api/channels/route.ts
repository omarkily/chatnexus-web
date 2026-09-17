import { NextResponse } from 'next/server';

// Mock data for demonstration, replace with actual DB calls 
const mockChannels = [
  {
    id: 1,
    name: "Customer Support",
    type: "whatsapp",
    phoneNumber: "+1234567890",
    status: "active",
    createdAt: "2023-10-01T12:00:00.000Z",
  },
  {
    id: 2,
    name: "Sales Team",
    type: "whatsapp",
    phoneNumber: "+1987654321",
    status: "pending",
    createdAt: "2023-10-15T09:30:00.000Z",
  },
];

export async function GET() {
  try {
    // In a real application, fetch data from your database
    return NextResponse.json(mockChannels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
} 