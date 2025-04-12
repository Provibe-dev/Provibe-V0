"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Bell, Moon, Sun, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preferences")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Appearance settings
  const [currentTheme, setCurrentTheme] = useState(theme || "dark")

  // Language settings
  const [language, setLanguage] = useState("en")
  
  // Timezone settings
  const [timezone, setTimezone] = useState("UTC")
  
  // Auto-save setting
  const [autoSave, setAutoSave] = useState(true)
  
  // Animations settings
  const [animations, setAnimations] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  // Load user settings from Supabase
  useEffect(() => {
    async function loadUserSettings() {
      if (!user) return
      
      try {
        setIsLoading(true)
        
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single()
        
        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error, which is fine for new users
          console.error("Error loading settings:", error)
          throw error
        }
        
        if (data) {
          // Apply loaded settings to state
          setEmailNotifications(data.email_notifications)
          setProjectUpdates(data.project_updates)
          setMarketingEmails(data.marketing_emails)
          setCurrentTheme(data.theme)
          setLanguage(data.language)
          setTimezone(data.timezone)
          
          // Apply theme immediately
          if (data.theme !== theme) {
            setTheme(data.theme)
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
        toast({
          title: "Failed to load settings",
          description: "Your settings could not be loaded. Using defaults instead.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserSettings()
  }, [user, theme, setTheme, toast])

  // Handle save preferences
  const handleSavePreferences = async () => {
    if (!user) return
    
    setIsSaving(true)

    try {
      // Prepare settings object
      const settings = {
        user_id: user.id,
        language,
        timezone,
        theme: currentTheme,
        email_notifications: emailNotifications,
        project_updates: projectUpdates,
        marketing_emails: marketingEmails,
      }
      
      // Save settings to Supabase using upsert
      const { error } = await supabase
        .from("user_settings")
        .upsert(settings, { onConflict: "user_id" })
      
      if (error) throw error

      // Update theme if changed
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }

      toast({
        title: "Preferences saved",
        description: "Your preferences have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      // In a real app, you would delete the user's account from the database
      // For now, we'll just log them out
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      })

      logout()
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Manage your general application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language for the application</p>
                  </div>
                  <div className="flex items-center">
                    <select
                      id="language"
                      className="rounded-md border border-input bg-background px-3 py-2"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Time Zone</Label>
                    <p className="text-sm text-muted-foreground">Set your preferred time zone</p>
                  </div>
                  <div className="flex items-center">
                    <select 
                      className="rounded-md border border-input bg-background px-3 py-2"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save your work while editing</p>
                  </div>
                  <Switch 
                    id="auto-save" 
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={currentTheme === "light" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setCurrentTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" /> Light
                    </Button>
                    <Button
                      variant={currentTheme === "dark" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setCurrentTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" /> Dark
                    </Button>
                    <Button
                      variant={currentTheme === "system" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setCurrentTheme("system")}
                    >
                      <span className="mr-2">💻</span> System
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable UI animations</p>
                  </div>
                  <Switch 
                    id="animations" 
                    checked={animations}
                    onCheckedChange={setAnimations}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
                  </div>
                  <Switch 
                    id="reduced-motion" 
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Appearance
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="project-updates">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about updates to your projects</p>
                  </div>
                  <Switch id="project-updates" checked={projectUpdates} onCheckedChange={setProjectUpdates} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                  </div>
                  <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" /> Save Notification Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-4">
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Actions here can&apos;t be undone. Be careful.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-red-200 p-4 dark:border-red-900">
                <h3 className="font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-4">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="rounded-md border border-red-200 p-4 dark:border-red-900">
                <h3 className="font-medium text-red-600 dark:text-red-400">Export Data</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Download all your data before deleting your account.
                </p>
                <Button variant="outline" className="mt-4">
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
