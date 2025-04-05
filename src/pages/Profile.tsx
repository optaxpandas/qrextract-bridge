
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Building } from "lucide-react";
import Navbar from '@/components/Navbar';
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  
  // Profile form state
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [company, setCompany] = useState("Acme Inc.");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Avatar state 
  const [initials, setInitials] = useState("JD");
  
  // Form handlers
  const handleProfileSave = () => {
    // Save to localStorage
    localStorage.setItem('profile-name', name);
    localStorage.setItem('profile-email', email);
    localStorage.setItem('profile-phone', phone);
    localStorage.setItem('profile-company', company);
    
    // Update initials
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length > 1) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
      } else if (nameParts.length === 1) {
        setInitials(`${nameParts[0][0]}${nameParts[0][1] || ''}`);
      }
      localStorage.setItem('profile-initials', initials);
    }
    
    toast.success("Profile information updated successfully");
  };
  
  const handlePasswordSave = () => {
    // Basic validation
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    // In a real app, this would make an API call to change the password
    toast.success("Password updated successfully");
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleAvatarChange = () => {
    toast.info("This would open a file picker in a real application");
  };
  
  // Load saved profile data on mount
  React.useEffect(() => {
    const savedName = localStorage.getItem('profile-name');
    const savedEmail = localStorage.getItem('profile-email');
    const savedPhone = localStorage.getItem('profile-phone');
    const savedCompany = localStorage.getItem('profile-company');
    const savedInitials = localStorage.getItem('profile-initials');
    
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedPhone) setPhone(savedPhone);
    if (savedCompany) setCompany(savedCompany);
    if (savedInitials) setInitials(savedInitials);
    
    // Calculate initials if not saved yet
    if (!savedInitials && savedName) {
      const nameParts = savedName.split(' ');
      if (nameParts.length > 1) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
      } else if (nameParts.length === 1) {
        setInitials(`${nameParts[0][0]}${nameParts[0][1] || ''}`);
      }
    }
  }, []);
  
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
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{name}</h3>
                  <p className="text-muted-foreground">{email}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleAvatarChange}>
                    Change Avatar
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="company" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="pl-10" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setName("John Doe");
                setEmail("john.doe@example.com");
                setPhone("+1 (555) 123-4567");
                setCompany("Acme Inc.");
              }}>
                Cancel
              </Button>
              <Button onClick={handleProfileSave}>Save Changes</Button>
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
                <Input 
                  id="current-password" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSave}>Update Password</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
