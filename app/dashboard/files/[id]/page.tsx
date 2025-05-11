import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";


async function ChatToFilePage(
  //    {
  //   params: { id },
  // }: {
  //   params: {
  //     id: string;
  //   };
  // }
  props: { params: { id: string } }


) {
  await auth.protect();
  const { userId } = await auth();

  // const { id } = params;
  // const { id } = await props.params;
  const { id } = props.params;
  // const id =   params.id;
  // const id =   Propid;

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

        <Chat id={id} />
      </div>
      {/* {left} */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        {/* pdf view */}

        <PdfView url={url} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
