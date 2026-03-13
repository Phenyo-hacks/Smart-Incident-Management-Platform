"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImpactLevel, UrgencyLevel } from "@/types/domain";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  subcategoryId: z.string().optional(),
  impact: z.nativeEnum(ImpactLevel),
  urgency: z.nativeEnum(UrgencyLevel),
});

type FormData = z.infer<typeof formSchema>;

// Mock categories - replace with actual API call
const mockCategories = [
  {
    id: "1",
    name: "Infrastructure",
    subcategories: [
      { id: "1-1", name: "Email" },
      { id: "1-2", name: "Servers" },
      { id: "1-3", name: "Storage" },
    ],
  },
  {
    id: "2",
    name: "Network",
    subcategories: [
      { id: "2-1", name: "VPN" },
      { id: "2-2", name: "WiFi" },
      { id: "2-3", name: "Firewall" },
    ],
  },
  {
    id: "3",
    name: "Hardware",
    subcategories: [
      { id: "3-1", name: "Laptop" },
      { id: "3-2", name: "Desktop" },
      { id: "3-3", name: "Printer" },
      { id: "3-4", name: "Monitor" },
    ],
  },
  {
    id: "4",
    name: "Software",
    subcategories: [
      { id: "4-1", name: "Installation" },
      { id: "4-2", name: "Updates" },
      { id: "4-3", name: "Licensing" },
    ],
  },
  {
    id: "5",
    name: "Access",
    subcategories: [
      { id: "5-1", name: "Permissions" },
      { id: "5-2", name: "Account" },
      { id: "5-3", name: "Password Reset" },
    ],
  },
];

export function CreateIncidentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      impact: ImpactLevel.Medium,
      urgency: UrgencyLevel.Medium,
    },
  });

  const selectedCategory = mockCategories.find(
    (c) => c.id === form.watch("categoryId")
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log("Creating incident:", data);
      console.log("Attachments:", attachments);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to incidents list
      router.push("/incidents");
    } catch (error) {
      console.error("Failed to create incident:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate priority based on impact and urgency
  const getPriority = (impact: ImpactLevel, urgency: UrgencyLevel) => {
    const matrix: Record<string, string> = {
      "High-High": "P1 - Critical",
      "High-Medium": "P2 - High",
      "High-Low": "P3 - Medium",
      "Medium-High": "P2 - High",
      "Medium-Medium": "P3 - Medium",
      "Medium-Low": "P4 - Low",
      "Low-High": "P3 - Medium",
      "Low-Medium": "P4 - Low",
      "Low-Low": "P4 - Low",
    };
    return matrix[`${impact}-${urgency}`] || "P3 - Medium";
  };

  const impact = form.watch("impact");
  const urgency = form.watch("urgency");
  const calculatedPriority = getPriority(impact, urgency);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide a clear description of the issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief summary of the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short, descriptive title for the incident
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue in detail. Include steps to reproduce, error messages, and any other relevant information."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
            <CardDescription>
              Help us route your incident to the right team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedCategory}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategory?.subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ImpactLevel.High}>
                          High - Affects many users or critical systems
                        </SelectItem>
                        <SelectItem value={ImpactLevel.Medium}>
                          Medium - Affects some users or important systems
                        </SelectItem>
                        <SelectItem value={ImpactLevel.Low}>
                          Low - Affects few users or non-critical systems
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UrgencyLevel.High}>
                          High - Needs immediate attention
                        </SelectItem>
                        <SelectItem value={UrgencyLevel.Medium}>
                          Medium - Should be addressed soon
                        </SelectItem>
                        <SelectItem value={UrgencyLevel.Low}>
                          Low - Can wait
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm">
                <span className="text-muted-foreground">
                  Calculated Priority:{" "}
                </span>
                <span className="font-medium">{calculatedPriority}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>
              Add screenshots, logs, or other relevant files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="size-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF, DOC up to 10MB
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.txt,.log"
                />
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create Incident
          </Button>
        </div>
      </form>
    </Form>
  );
}
