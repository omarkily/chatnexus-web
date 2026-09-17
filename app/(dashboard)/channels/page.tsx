"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
} from "@heroui/react";
import { toast } from "@/components/toast";

// Define channel types
interface Channel {
  id: number;
  name: string;
  type: string;
  phoneNumber?: string;
  status: string;
  createdAt: string;
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [channelName, setChannelName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch channels on component mount
  useEffect(() => {
    fetchChannels();
  }, []);

  // Refresh QR code every 20 seconds if it exists
  useEffect(() => {
    if (!qrCodeUrl || !accountId) return;

    const interval = setInterval(() => {
      // Append a timestamp to force reload of the iframe content
      setQrCodeUrl(`${qrCodeUrl.split("?")[0]}?t=${new Date().getTime()}`);
    }, 20000);

    return () => clearInterval(interval);
  }, [qrCodeUrl, accountId]);

  const fetchChannels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/channels");
      if (!response.ok) {
        throw new Error("Failed to fetch channels");
      }
      const data = await response.json();
      setChannels(data);
    } catch (err) {
      console.error("Error fetching channels:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch channels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChannel = () => {
    setIsPlatformModalOpen(true);
  };

  const handleSelectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setIsPlatformModalOpen(false);

    if (platform === "whatsapp") {
      setIsWhatsAppModalOpen(true);
    } else {
      toast.info("This platform is not available yet.");
    }
  };

  const handleConnectWhatsApp = async () => {
    if (!channelName || !phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: channelName,
          phone: phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect WhatsApp");
      }

      const data = await response.json();
      if (data.success) {
        setQrCodeUrl(data.qrCodeUrl);
        setAccountId(data.accountId);
        toast.success(data.message);
      } else {
        throw new Error(data.message || "Failed to connect WhatsApp");
      }
    } catch (err) {
      console.error("Error connecting WhatsApp:", err);
      toast.error(err instanceof Error ? err.message : "Failed to connect WhatsApp");
    } finally {
      setIsConnecting(false);
    }
  };

  // Platform cards for the modal
  const platformCards = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Connect WhatsApp for direct messaging with customers",
      enabled: true,
    },
    {
      id: "telegram",
      name: "Telegram",
      description: "Connect Telegram for automated chat support",
      enabled: false,
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Connect Instagram for DM automation",
      enabled: false,
    },
    {
      id: "facebook",
      name: "Facebook Messenger",
      description: "Connect Facebook Messenger for customer support",
      enabled: false,
    },
  ];

  // WhatsApp options for the second modal
  const whatsappOptions = [
    {
      id: "whatsapp-regular",
      name: "WhatsApp",
      description:
        "Connecting any WhatsApp account in a single minute with the ability to write first.",
      enabled: true,
    },
    {
      id: "whatsapp-waba",
      name: "WABA",
      description:
        "The official way to connect WhatsApp Business accounts with the ability to do newsletters.",
      enabled: false,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Channels</h1>
        <Button
          color="primary"
          className="bg-emerald-600 hover:bg-emerald-700"
          onPress={handleAddChannel}
        >
          Add Channel
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="primary" size="lg" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      ) : channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="border-emerald-100 dark:border-emerald-800/30">
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    {channel.type === "whatsapp" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{channel.name}</h3>
                    <p className="text-sm text-gray-500">
                      {channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {channel.phoneNumber && (
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-medium">{channel.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`font-medium ${
                        channel.status === "active"
                          ? "text-emerald-600"
                          : channel.status === "pending"
                            ? "text-amber-600"
                            : "text-gray-600"
                      }`}
                    >
                      {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(channel.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <div className="text-gray-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No channels have been added yet</p>
          <Button
            color="primary"
            className="bg-emerald-600 hover:bg-emerald-700"
            onPress={handleAddChannel}
          >
            Add Your First Channel
          </Button>
        </div>
      )}

      {/* Platform Selection Modal */}
      <Modal isOpen={isPlatformModalOpen} onClose={() => setIsPlatformModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Select Messaging Platform</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platformCards.map((platform) => (
                <Card
                  key={platform.id}
                  isPressable={platform.enabled}
                  isDisabled={!platform.enabled}
                  className={`border ${platform.enabled ? "border-emerald-100 hover:border-emerald-300 dark:border-emerald-800/30 hover:dark:border-emerald-700/50" : "border-gray-200 dark:border-gray-700/30 opacity-60"}`}
                  onPress={() => platform.enabled && handleSelectPlatform(platform.id)}
                >
                  <CardBody className="gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{platform.name}</h3>
                      {!platform.enabled && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {platform.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsPlatformModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* WhatsApp Options Modal */}
      <Modal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)}>
        <ModalContent>
          <ModalHeader>WhatsApp Connection Options</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-4">
              {whatsappOptions.map((option) => (
                <Card
                  key={option.id}
                  isPressable={option.enabled}
                  isDisabled={!option.enabled}
                  className={`border ${option.enabled ? "border-emerald-100 hover:border-emerald-300 dark:border-emerald-800/30 hover:dark:border-emerald-700/50" : "border-gray-200 dark:border-gray-700/30 opacity-60"}`}
                  onPress={() => {
                    if (option.enabled) {
                      if (option.id === "whatsapp-waba") {
                        toast.info("WABA integration is coming soon");
                      } else {
                        setIsWhatsAppModalOpen(false);
                        setIsAddModalOpen(true);
                      }
                    }
                  }}
                >
                  <CardBody className="gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{option.name}</h3>
                      {!option.enabled && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsWhatsAppModalOpen(false)}>
              Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* WhatsApp Connection Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Connect WhatsApp</ModalHeader>
          <ModalBody>
            {!qrCodeUrl ? (
              <div className="space-y-4">
                <Input
                  label="Channel Name"
                  placeholder="My WhatsApp Channel"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  isRequired
                />
                <Input
                  label="Phone Number"
                  placeholder="+123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  isRequired
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-sm">Scan this QR code with your WhatsApp app</p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-64 flex items-center justify-center">
                  <iframe
                    title="qr-code"
                    src={qrCodeUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                  ></iframe>
                </div>
                <p className="mt-2 text-xs text-gray-500">QR code refreshes every 20 seconds</p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setIsAddModalOpen(false);
                setQrCodeUrl(null);
                setAccountId(null);
                setChannelName("");
                setPhoneNumber("");
              }}
            >
              Cancel
            </Button>
            {!qrCodeUrl && (
              <Button
                color="success"
                className="bg-emerald-600 hover:bg-emerald-700"
                onPress={handleConnectWhatsApp}
                isLoading={isConnecting}
                isDisabled={isConnecting || !channelName || !phoneNumber}
              >
                Connect
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
