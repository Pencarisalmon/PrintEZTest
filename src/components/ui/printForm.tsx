"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Tambahkan validasi untuk nomor form
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(50),
  phoneNumber: z
    .string()
    .regex(/^\d{10,15}$/, { message: "Invalid phone number format." }),
  type: z.enum(["Hitam-putih", "Berwarna"], {
    required_error: "Pilih tipe print.",
  }),
  place: z
    .string({
      required_error: "Please select a place.",
    })
    .min(1, { message: "Place is required." }),
  time: z
    .string({
      required_error: "Please select a time.",
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Invalid time format. Use HH:MM.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const timeOptions = ["12:30", "13:00", "14:30", "15:00"]; // Pilihan waktu
const placeOptions = ["Selasar FIK", "Smile Garden", "Masjid Manbaul Ulum"]; // Pilihan tempat
const apiUrl = "/api/v1/form";

type PrintFormProps = {
  onNext: () => void; // Fungsi untuk pindah ke step 3
  onBack: () => void;
};

const PrintForm: React.FC<PrintFormProps> = ({ onNext, onBack }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: " ",
      phoneNumber: "",
      place: undefined,
      time: undefined,
      dob: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    debugger;
    console.log(values);
    const { username, phoneNumber, type, place, dob, time } = values;
    try {
    // Send form data to the API
    const {data} = await axios.post(apiUrl, {
      username,
      phoneNumber,
      type,
      place,
      dob,
      time,
    });

    // Handle successful response
    console.log("Form submitted successfully:", data);
    sessionStorage.setItem("idForm", data.dataInsert.id);
    debugger;
    onNext();
  } catch (error) {
    // Handle errors
    console.error("Error submitting form:", error);
    alert("Failed to submit form. Please try again.");
  }
    debugger;
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-5">
          Form Pemesanan
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Input Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    {/* This is your public display name. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Nomor Telepon */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Whatsapp</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="081234567890"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan nomor telepon yang valid (10-15 digit).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Tipe Print */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pilh tipe print</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row mt-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Hitam-putih" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Hitam-putih
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Berwarna" />
                        </FormControl>
                        <FormLabel className="font-normal">Berwarna</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dropdown Tempat */}
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih tempat pengantaran</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tempat pengantaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {placeOptions.map((place) => (
                          <SelectItem key={place} value={place}>
                            {place}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Tanggal */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pengantaran</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {/* Your date of birth is used to calculate your age. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input Waktu */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih waktu pengantaran</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih waktu pengantaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    Masukan waktu pengantaran agar kami bisa mengantarkan di
                    waktu yg tepat
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="reset" onClick={onBack}>
                Kembali
              </Button>
              <Button type="submit">
              {/* <Button type="submit" onClick={onNext}> */}
                Selanjutnya
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PrintForm;
