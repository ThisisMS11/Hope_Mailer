"use client";

import React, { useState } from "react";

import {
  Loader2,
  User,
  Briefcase,
  Mail,
  Phone,
  Clock,
  Linkedin,
  MapPin,
  Repeat,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useRef } from "react";
import { positionType, Gender } from "@/utils/constants";
import AddEmployeeCompany from "@/components/AddEmployeeCompany";

const DialogBox = ({
  buttonRef,
  fetchContacts,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
  fetchContacts: any;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    positionType: "",
    companyId: "",
    email: "",
    gender: "",
    mobile: "",
    experience: 0,
    linkedIn: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePositionTypeChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      positionType: value,
    }));
  };
  const handleGenderChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };

  /* Handles adding a new employee to database */
  const handleSubmit = async () => {
    // console.log(formData);
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/contacts`;
      const response = await axios.post(url, formData);
      console.log(response.data);
      toast.success("New Employee added successfully", {
        duration: 3000,
      });

      /* refreshing contacts to see changes on screen */
      fetchContacts();
    } catch (error) {
      console.error(`Some error happened while creating employee : ${error}`);
      toast.error("Error while creating new employee", {
        duration: 3000,
        icon: <ShieldAlert size={20} color="red" />,
      });
    }
    setLoading(false);
    if (closeRef.current) closeRef.current.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" ref={buttonRef} className="hidden">
          Add New User
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="dialog-content">
        <DialogTitle className="hidden">useless title</DialogTitle>
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>
              Fill in the details to add a new user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="professional">
                  Professional Info
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-4">
                    <User className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="mobile">Phone Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter phone number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Repeat className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="position">Gender</Label>
                      <Select
                        onValueChange={handleGenderChange}
                        defaultValue=""
                        value={formData.gender}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {Gender &&
                            Gender.map((g: string, index) => {
                              return (
                                <SelectItem key={index} value={g}>
                                  {g}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="professional">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-4">
                    <Briefcase className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="positionType">Position Type</Label>
                      <Select
                        onValueChange={handlePositionTypeChange}
                        defaultValue=""
                        value={formData.positionType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {positionType &&
                            positionType.map((position: any, index) => {
                              return (
                                <SelectItem key={index} value={position.name}>
                                  {position.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Briefcase className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="position">Position Name</Label>
                      <Input
                        id="position"
                        onChange={handleChange}
                        name="position"
                        placeholder="Enter Position Name"
                        defaultValue=""
                        value={formData.position}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Briefcase className="text-gray-500" />
                    <div className="flex items-center">
                      <Label htmlFor="company" className="mr-4">
                        Company
                      </Label>
                      <AddEmployeeCompany
                        formData={formData}
                        setFormData={setFormData}
                      />
                      <div></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="Enter experience (e.g., 3 years)"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Linkedin className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="linkedIn">LinkedIn ID</Label>
                      <Input
                        id="linkedIn"
                        placeholder="Enter LinkedIn ID"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="w-full">
                Submit
              </Button>
            )}
          </CardFooter>
        </Card>

        <DialogClose asChild className="hidden">
          <Button type="button" variant="secondary" ref={closeRef}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DialogBox);
