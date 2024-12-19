"use client"

import React, { useState } from 'react'
import { Loader2, User, Briefcase, Mail, Phone, Clock, Linkedin, MapPin } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DialogBox = ({
    buttonRef,
}: {
    buttonRef: React.RefObject<HTMLButtonElement>
}) => {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        company: '',
        email: '',
        phone_no: '',
        experience: '',
        linkedInId: '',
        location: '',
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handlePositionChange = (value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            position: value,
        }))
    }

    const handleSubmit = () => {
        setLoading(true)
        // Simulate a request or call a function to add user to the database
        console.log(formData)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" ref={buttonRef} className="hidden">
                    Add New User
                </Button>
            </DialogTrigger>

            <DialogContent >
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
                                <TabsTrigger value="professional">Professional Info</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal">
                                <div className="space-y-4 mt-4">
                                    <div className="flex items-center space-x-4">
                                        <User className="text-gray-500" />
                                        <div className="flex-1">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter name"
                                                name="name"
                                                value={formData.name}
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
                                            <Label htmlFor="phone_no">Phone Number</Label>
                                            <Input
                                                id="phone_no"
                                                placeholder="Enter phone number"
                                                name="phone_no"
                                                value={formData.phone_no}
                                                onChange={handleChange}
                                            />
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
                                            <Label htmlFor="linkedInId">LinkedIn ID</Label>
                                            <Input
                                                id="linkedInId"
                                                placeholder="Enter LinkedIn ID"
                                                name="linkedInId"
                                                value={formData.linkedInId}
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
                            <Button onClick={handleSubmit} className="w-full">Submit</Button>
                        )}
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(DialogBox)

