import { useState } from "react";

interface CollectInfo {
  name: string;
  email: string;
  phone: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customFields: Record<string, string>; // dynamic extra fields
}

const useCollectInfo = () => {
  const [collectInfo, setCollectInfo] = useState<CollectInfo>({
    name: "",
    email: "",
    phone: "",
    billingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    shippingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    customFields: {},
  });

  // Helper to update nested fields
  const updateField = (path: string, value: string) => {
    setCollectInfo((prev) => {
      const newState = { ...prev };
      const keys = path.split("."); // e.g., "billingAddress.city"
      let temp: any = newState;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          temp[key] = value;
        } else {
          temp = temp[key];
        }
      });
      return newState;
    });
  };

  return { collectInfo, setCollectInfo, updateField };
};

export default useCollectInfo;
