
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import Navbar from '@/components/Navbar';
import { Palette, Bell, Shield, Monitor, Moon, Sun, LayoutGrid } from 'lucide-react';

const Settings = () => {
  const [theme, setTheme] = useState("light");
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} />
      
      <div className="container max-w-4xl pt-24 pb-12 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-2">Settings</h1>
          <p className="text-muted-foreground text-center">Customize your application experience</p>
        </div>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)}>
                    <ToggleGroupItem value="light" aria-label="Light mode" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" aria-label="Dark mode" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" aria-label="System default" className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>System</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Layout Density */}
                <div className="space-y-3">
                  <Label>Layout Density</Label>
                  <ToggleGroup type="single" defaultValue="comfortable">
                    <ToggleGroupItem value="compact" aria-label="Compact layout">
                      Compact
                    </ToggleGroupItem>
                    <ToggleGroupItem value="comfortable" aria-label="Comfortable layout">
                      Comfortable
                    </ToggleGroupItem>
                    <ToggleGroupItem value="spacious" aria-label="Spacious layout">
                      Spacious
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Display Options */}
                <div className="space-y-3">
                  <Label>Display Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-motion">Reduce motion</Label>
                        <p className="text-sm text-muted-foreground">
                          Minimize animation effects
                        </p>
                      </div>
                      <Switch id="reduce-motion" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-data">Reduced data usage</Label>
                        <p className="text-sm text-muted-foreground">
                          Lower resolution images and content
                        </p>
                      </div>
                      <Switch id="reduced-data" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-grid">Show grid lines</Label>
                        <p className="text-sm text-muted-foreground">
                          Display grid lines in table views
                        </p>
                      </div>
                      <Switch id="show-grid" defaultChecked />
                    </div>
                  </div>
                </div>
                
                {/* Color Accent */}
                <div className="space-y-3">
                  <Label>Color Accent</Label>
                  <div className="flex flex-wrap gap-2">
                    {["violet", "blue", "green", "yellow", "orange", "red", "pink"].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 ring-offset-background ${color === 'violet' ? 'ring-2 ring-offset-2' : ''}`}
                        aria-label={`${color} accent color`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts on your device
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>
                  Manage your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Activity Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Show when you're active on the platform
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous usage data collection
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
