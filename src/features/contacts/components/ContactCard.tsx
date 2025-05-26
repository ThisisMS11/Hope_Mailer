"use client";
import React, { useState } from "react";
import { ContactI } from "@/features/contacts/types";
import { Image } from "@/imports/Nextjs_imports";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Edit,
  Check,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface ContactCardProps {
  contact: ContactI;
  onContactUpdate?: (updatedContact: ContactI) => void;
  onContactDelete?: (contactId: number) => void;
  isChecked?: boolean;
  onCheckChange?: (contactId: number, isChecked: boolean) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onContactUpdate,
  onContactDelete,
  isChecked = false,
  onCheckChange,
}) => {
  // Calculate a fake progress percentage
  const progressPercentage = Math.floor(contact.experience * 10);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedContact, setEditedContact] = useState<ContactI>({ ...contact });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: keyof ContactI) => {
    setEditedContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onContactUpdate) {
      onContactUpdate(editedContact);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (onContactDelete) {
      onContactDelete(contact.id);
    }
    setIsDeleteModalOpen(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckChange) {
      onCheckChange(contact.id, e.target.checked);
    }
  };

  return (
    <div className="relative w-64 rounded-2xl shadow-md p-4 pt-6 flex flex-col items-center bg-white dark:bg-[#16151c]">
      {/* Checkbox - Top Left */}
      <label className="absolute top-3 left-3 w-4 h-4 inline-flex items-start">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="
      peer
      appearance-none
      w-4 h-4
      bg-white
      border-2 border-gray-300
      rounded
      cursor-pointer
      transition
      peer-checked:border-black
      peer-focus:outline-none
    "
        />
        {/* replace the default tick with an SVG, only visible when checked */}
        <svg
          className="
      pointer-events-none
      absolute top-0 left-0
      w-4 h-4
      stroke-black
      stroke-[3px]
      opacity-0
      peer-checked:opacity-100
      transition-opacity
    "
          viewBox="0 0 16 16"
          fill="none"
        >
          <polyline points="3.5 8.5 6.5 11.5 12.5 5.5" />
        </svg>
      </label>

      {/* Edit Menu - Top Right */}
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuItem
              onClick={() => setIsEditModalOpen(true)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Contact</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              <span>Delete Contact</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Image with border and online dot */}
      <div className="relative">
        <Image
          src={contact.logo}
          alt={`${contact.firstName} ${contact.lastName}`}
          width={100}
          height={100}
          className="w-20 h-20 rounded-full border-4 border-blue-200"
        />
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </div>

      {/* Name and Email */}
      <div className="text-center mt-3">
        <h2 className="text-md font-semibold text-gray-900 dark:text-white">
          {contact.firstName} {contact.lastName}
        </h2>
        <p className="text-sm text-gray-500 dark:text-white mt-1">
          {contact.companyName}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-4 px-4">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <span className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="w-2 h-2 bg-blue-300 rounded-full" />
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Role */}
      <div className="mt-4 text-center text-xs font-medium text-gray-600 tracking-wide dark:text-white">
        {contact.position.toUpperCase()}
      </div>

      {/* Edit Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={editedContact.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={editedContact.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={editedContact.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={editedContact.mobile}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <Input
                id="linkedIn"
                name="linkedIn"
                value={editedContact.linkedIn}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={editedContact.position}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionType">Position Type</Label>
              <Select
                value={editedContact.positionType}
                onValueChange={(value) =>
                  handleSelectChange(value, "positionType")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TALENT">Talent</SelectItem>
                  <SelectItem value="ENGINEERING">Engineering</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="HEAD">Head</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={editedContact.experience.toString()}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={editedContact.gender}
                onValueChange={(value) => handleSelectChange(value, "gender")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the contact for{" "}
              {contact.firstName} {contact.lastName}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactCard;
