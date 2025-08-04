import ResumeFeedback from "@/components/ResumeFeedback";
import { getResumeById } from "@/lib/actions/general.action";

async function page({ params }) {
  const { id } = await params;

  const data = await getResumeById(id);

  return (
    <>
      <ResumeFeedback resumeData={data.data} />
    </>
  );
}

export default page;
