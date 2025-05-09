"use client";
import { useState } from "react";
import Image from "next/image";
// Define an interface for the expected structure of the Midtrans Snap result object
// Add more properties as needed based on the actual data Midtrans returns
interface MidtransSnapResult {
  transaction_status?: string;
  order_id?: string;
  payment_type?: string;
  gross_amount?: string;
  status_code?: string;
  status_message?: string;
  fraud_status?: string;
  transaction_id?: string;
  // You might need to add more properties depending on what you expect to use
  // from the result object (e.g., va_numbers, permata_va_number, etc.)
}


declare global {
  interface Window {
    snap: {
      embed: (token: string, options: {
        embedId: string;
        // Use the defined interface for the result parameter instead of any
        onSuccess?: (result: MidtransSnapResult) => void;
        onPending?: (result: MidtransSnapResult) => void;
        onError?: (result: MidtransSnapResult) => void;
        onClose?: () => void;
      }) => void;
      // If you also use window.snap.pay(), declare it here too:
      // pay?: (token: string, options?: { ... }) => void;
    };
  }
}

import PrintForm from "@/components/ui/printForm";
import { Button } from "@/components/ui/button";
import axios from "axios";

const PrintProcess = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Jika file adalah gambar atau PDF, tampilkan preview
      if (
        selectedFile.type.includes("image") ||
        selectedFile.type === "application/pdf"
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null); // Tidak menampilkan preview jika bukan gambar/PDF
      }
    }
  };

  const uploadFileToServer = async () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = "/api/v1/upload";
      // Add a type assertion or interface for the axios response data
      const { data: result } = await axios.post<{ data: { id: string } }>(apiUrl, formData);
      const fileId = result.data.id;
      console.log("File ID:", fileId);
      sessionStorage.setItem("idFiles", fileId);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again later.");
    }
  };

  const getPayment = async () => {
    const idFiles = sessionStorage.getItem("idFiles");
    const idForms = sessionStorage.getItem("idForm");
    if (!idFiles || !idForms) {
      alert("Mulai dari awal");
      return;
    }
    console.log(idFiles, idForms);
    const apiUrl = "/api/v1/transaction";
    // Add a type assertion or interface for the axios response data
    const { data: result } = await axios.post<{ data: { error?: string; midtrans_token: string; id: string } }>(apiUrl, {
      idFiles,
      idForms,
    });
    console.log("Data dari server:", result);
    const data = result.data;
    if (data.error) {
      console.error("Error:", data.error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
      return;
    }
    const token = data.midtrans_token;
    const transactionId = data.id;
    console.log("Token Midtrans:", token);
    if (!token) {
      throw new Error("Token Midtrans tidak ditemukan.");
    }

    const updateTransaction = async (status: string) => {
      try {
        await axios.put(apiUrl, {
          idTransaction: transactionId,
          status,
        });
        console.log(`Transaksi diperbarui ke status: ${status}`);
      } catch (error) {
        console.error("Gagal memperbarui transaksi:", error);
      }
    };

    if (window.snap && window.snap.embed) { // Check if snap.embed is available
      window.snap.embed(token, {
        embedId: "snap-embed-container",
        // Removed `:any` here. TypeScript infers the type from the global declaration.
        onSuccess: async (result) => {
          await updateTransaction("paid");
          console.log("Pembayaran berhasil:", result);
          alert("Pembayaran berhasil!");
          sessionStorage.clear();
        },
        // Removed `:any` here. TypeScript infers the type from the global declaration.
        onPending: (result) => {
          console.log("Menunggu pembayaran:", result);
          alert("Pembayaran masih dalam proses.");
        },
        // Removed `:any` here. TypeScript infers the type from the global declaration.
        onError: (result) => {
          console.error("Pembayaran gagal:", result);
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          console.warn("Popup ditutup tanpa menyelesaikan pembayaran.");
          alert("Anda belum menyelesaikan pembayaran.");
        },
      });
    } else {
        console.error("Midtrans Snap script not loaded.");
        alert("Payment system not available. Please try again later.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">PrintEZ</h1>

      <div className="flex flex-col items-center">
        {/* Sidebar Navigation */}
        <div className="w-2xl flex flex-row justify-between text-blue-950 p-4">
          <div className={`py-2 ${step === 1 ? "font-bold" : ""}`}>
            1. Unggah File
          </div>
          <div className={`py-2 ${step === 2 ? "font-bold" : ""}`}>
            2. Form Pemesanan
          </div>
          <div className={`py-2 ${step === 3 ? "font-bold" : ""}`}>
            3. Pembayaran
          </div>
        </div>

        {/* Step Content */}
        <div className="w-2xl p-4">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl mb-2">Unggah filemu</h2>
              <input
                id ="file-upload"
                type="file"
                onChange={handleFileUpload}
                className="border p-2 w-full"
              />

              {/* Tampilkan Preview File */}
              {preview ? (
                <div className="mt-4">
                  {file?.type.includes("image") ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      className="w-40 h-auto border p-2"
                    />
                  ) : file?.type === "application/pdf" ? (
                    <iframe
                      src={preview}
                      className="w-full h-56 border p-2"
                    ></iframe>
                  ) : null}
                </div>
              ) : file ? (
                <p className="mt-4 text-gray-600">{file.name}</p>
              ) : null}
              <Button onClick={async() => {await uploadFileToServer();setStep(2)}}>Selanjutnya</Button>
            </div>
          )}

          {step === 2 && (
            <PrintForm onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl mb-2">Pembayaran</h2>
              <button
                className="bg-green-500 text-white p-2"
                onClick={async() => {await getPayment()}}
              >
                Konfirmasi Pembayaran
              </button>
              <button
                className="bg-gray-500 text-white p-2 ml-2"
                onClick={() => setStep(2)}
              >
                Kembali
              </button>
              {/* The snap-embed-container is where the Midtrans Snap UI will be embedded */}
              <div id="snap-embed-container" className="mt-4 w-full" style={{ minHeight: '400px' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintProcess;