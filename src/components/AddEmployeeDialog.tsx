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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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

const DialogBox = ({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    company: "",
    email: "",
    gender: "",
    mobile: "",
    experience: 0,
    linkedIn: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePositionChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      position: value,
    }));
  };
  const handleGenderChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/contacts`;
      const response = await axios.post(url, formData);
      console.log(response.data);
    } catch (error) {
      console.error(`Some error happened while creating employee : ${error}`);
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

      <DialogContent>
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
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="not_know">not_know</SelectItem>
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
                      <Label htmlFor="position">Position</Label>
                      <Select
                        onValueChange={handlePositionChange}
                        defaultValue=""
                        value={formData.position}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Senior HR">Senior HR</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Senior SDE">Senior SDE</SelectItem>
                          <SelectItem value="Junior SDE">Junior SDE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Briefcase className="text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Enter company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
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
