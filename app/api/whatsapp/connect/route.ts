import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone number are required" },
        { status: 400 }
      );
    }

    // Mock data for demonstration purposes
    // In a real app, this would connect to the WhatsApp API
    const accountId = Math.floor(Math.random() * 10000);

    // Generate dummy QR code URL - in a real app this would come from the WhatsApp API
    // Using a public QR code generator service for demo
    const qrCodeData = encodeURIComponent(`WhatsApp Connect: ${name} (${phone})`);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeData}`;

    return NextResponse.json({
      success: true,
      message: "WhatsApp connection initiated successfully",
      accountId,
      qrCodeUrl,
    });
  } catch (error) {
    console.error("Error connecting WhatsApp:", error);
    return NextResponse.json(
      { success: false, message: "Failed to connect WhatsApp" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello, world!" });
}
