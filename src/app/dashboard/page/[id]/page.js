"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PageEditor() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      if (!id) return;
      const pageRef = doc(db, "pages", id);
      const pageSnap = await getDoc(pageRef);
      if (pageSnap.exists()) {
        setPage({ id: pageSnap.id, ...pageSnap.data() });
        setNewTitle(pageSnap.data().title);
      }
    };
    fetchPage();
  }, [id]);

  const handleUpdate = async () => {
    if (!page) return;
    try {
      await updateDoc(doc(db, "pages", page.id), {
        title: newTitle,
      });
      alert("Page updated!");
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  if (!page) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold">Edit Page</h1>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="p-2 mt-4 text-black rounded"
      />
      <button onClick={handleUpdate} className="mt-4 bg-green-500 px-4 py-2 rounded">
        Save Changes
      </button>
    </div>
  );
}
