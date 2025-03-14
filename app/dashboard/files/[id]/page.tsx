
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

async function ChatToFilePage(
  {
  params: { id },
}: {
  params: {
    id: string;
  };
}

// { params }: { params: { id?: string } }
) {
  await auth.protect();
  const { userId } = await auth();

  // if (!params || !params.id) {
  //   console.error("Error: Invalid or missing file ID", params);
  //   return <div>Error: Invalid File ID</div>;
  // }

  // const id =  params.id;

  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

    const url = ref.data()?.downloadUrl;

  return (

    
    <div className="grid lg:grid-cols-5 h-full overflow-hidden border border-red-500">
      {/* {right}   */}
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
        {/* {chat side} */}
      </div>
      {/* {left} */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        {/* pdf view */}

        <PdfView url={url}/>
      </div>
    </div>
  );
}

export default ChatToFilePage;
