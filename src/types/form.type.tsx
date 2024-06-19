export type ClientReg = {
  username: string;
  password: string;
  cpassword: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  address: string;
};
export type SC = {
  serviceName: string;
  salary: string;
  workingHours: string;
  timing: string;
  preferredLocation: string;
};
export type ProfileType = {
  _id?: string;
  username?: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  hired?: [];
  services?: [];
  clientDetails?: [];
  role?: string;
  isVerified?: string;
  currentStatus?: string;
  aadhar?: string;
  pan?: string;
  age?: string;
};
export type EmployeeReg = {
  username: string;
  password: string;
  cpassword: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  address: string;
  aadhar: string;
  pan: string;
  age: string;
};

export type CardType = {
  _id: string;
  name: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  isVerified: string;
  currentStatus: string;

  services: [
    {
      _id?: string;
      name: string;
      salary: number;
      workingHours: string;
      timing: string;
      preferredLocation: string;
    }
  ];
  payment: { type: String; enum: ["SUCCESS", "PENDING"]; default: "SUCCESS" };
};
