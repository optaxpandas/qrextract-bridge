
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Building } from "lucide-react";
import Navbar from '@/components/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} />
      
      <div className="container max-w-4xl pt-24 pb-12 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-2">Profile</h1>
          <p className="text-muted-foreground text-center">Manage your account information</p>
        </div>
        
        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">John Doe</h3>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Avatar
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" defaultValue="John Doe" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" defaultValue="john.doe@example.com" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" defaultValue="+1 (555) 123-4567" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="company" defaultValue="Acme Inc." className="pl-10" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
