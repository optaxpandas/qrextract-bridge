
import React, { useState, useEffect } from 'react';
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
import { toast } from "sonner";

const Settings = () => {
  // Theme settings
  const [theme, setTheme] = useState("light");
  const [layoutDensity, setLayoutDensity] = useState("comfortable");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reducedData, setReducedData] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [accentColor, setAccentColor] = useState("violet");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Privacy settings
  const [activityStatus, setActivityStatus] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // Apply theme changes when theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply selected theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  // Save settings handler
  const saveAppearanceSettings = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('layoutDensity', layoutDensity);
    localStorage.setItem('reduceMotion', reduceMotion.toString());
    localStorage.setItem('reducedData', reducedData.toString());
    localStorage.setItem('showGrid', showGrid.toString());
    localStorage.setItem('accentColor', accentColor);
    
    toast.success("Appearance settings saved");
  };
  
  const saveNotificationSettings = () => {
    localStorage.setItem('emailNotifications', emailNotifications.toString());
    localStorage.setItem('pushNotifications', pushNotifications.toString());
    localStorage.setItem('marketingEmails', marketingEmails.toString());
    
    toast.success("Notification settings saved");
  };
  
  const savePrivacySettings = () => {
    localStorage.setItem('activityStatus', activityStatus.toString());
    localStorage.setItem('dataCollection', dataCollection.toString());
    localStorage.setItem('twoFactorAuth', twoFactorAuth.toString());
    
    toast.success("Privacy settings saved");
  };
  
  // Load saved settings on component mount
  useEffect(() => {
    // Load theme settings
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
    
    const savedLayoutDensity = localStorage.getItem('layoutDensity');
    if (savedLayoutDensity) setLayoutDensity(savedLayoutDensity);
    
    const savedReduceMotion = localStorage.getItem('reduceMotion');
    if (savedReduceMotion) setReduceMotion(savedReduceMotion === 'true');
    
    const savedReducedData = localStorage.getItem('reducedData');
    if (savedReducedData) setReducedData(savedReducedData === 'true');
    
    const savedShowGrid = localStorage.getItem('showGrid');
    if (savedShowGrid) setShowGrid(savedShowGrid === 'true');
    
    const savedAccentColor = localStorage.getItem('accentColor');
    if (savedAccentColor) setAccentColor(savedAccentColor);
    
    // Load notification settings
    const savedEmailNotifications = localStorage.getItem('emailNotifications');
    if (savedEmailNotifications) setEmailNotifications(savedEmailNotifications === 'true');
    
    const savedPushNotifications = localStorage.getItem('pushNotifications');
    if (savedPushNotifications) setPushNotifications(savedPushNotifications === 'true');
    
    const savedMarketingEmails = localStorage.getItem('marketingEmails');
    if (savedMarketingEmails) setMarketingEmails(savedMarketingEmails === 'true');
    
    // Load privacy settings
    const savedActivityStatus = localStorage.getItem('activityStatus');
    if (savedActivityStatus) setActivityStatus(savedActivityStatus === 'true');
    
    const savedDataCollection = localStorage.getItem('dataCollection');
    if (savedDataCollection) setDataCollection(savedDataCollection === 'true');
    
    const savedTwoFactorAuth = localStorage.getItem('twoFactorAuth');
    if (savedTwoFactorAuth) setTwoFactorAuth(savedTwoFactorAuth === 'true');
  }, []);
  
  // Reset handlers
  const resetAppearanceSettings = () => {
    setTheme('light');
    setLayoutDensity('comfortable');
    setReduceMotion(false);
    setReducedData(false);
    setShowGrid(true);
    setAccentColor('violet');
    toast.info("Appearance settings reset to default");
  };
  
  const resetNotificationSettings = () => {
    setEmailNotifications(true);
    setPushNotifications(true);
    setMarketingEmails(false);
    toast.info("Notification settings reset to default");
  };
  
  const resetPrivacySettings = () => {
    setActivityStatus(true);
    setDataCollection(true);
    setTwoFactorAuth(false);
    toast.info("Privacy settings reset to default");
  };
  
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
                  <ToggleGroup type="single" value={layoutDensity} onValueChange={(value) => value && setLayoutDensity(value)}>
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
                      <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-data">Reduced data usage</Label>
                        <p className="text-sm text-muted-foreground">
                          Lower resolution images and content
                        </p>
                      </div>
                      <Switch id="reduced-data" checked={reducedData} onCheckedChange={setReducedData} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-grid">Show grid lines</Label>
                        <p className="text-sm text-muted-foreground">
                          Display grid lines in table views
                        </p>
                      </div>
                      <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
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
                        className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 ring-offset-background ${color === accentColor ? 'ring-2 ring-offset-2' : ''}`}
                        aria-label={`${color} accent color`}
                        onClick={() => setAccentColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetAppearanceSettings}>Reset to Default</Button>
                <Button onClick={saveAppearanceSettings}>Save Changes</Button>
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
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts on your device
                      </p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetNotificationSettings}>Reset to Default</Button>
                <Button onClick={saveNotificationSettings}>Save Changes</Button>
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
                    <Switch checked={activityStatus} onCheckedChange={setActivityStatus} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous usage data collection
                      </p>
                    </div>
                    <Switch checked={dataCollection} onCheckedChange={setDataCollection} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetPrivacySettings}>Reset to Default</Button>
                <Button onClick={savePrivacySettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
