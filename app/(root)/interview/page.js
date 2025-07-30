
import Agent from "../../../components/Agent"
import { getCurrentUser } from "../../../lib/actions/auth.action"

async function page() {

	const user = await getCurrentUser();



  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Agent username={user?.name} id={user?.uid} type={"generate"} />
      </div>
    </>
  );
}

export default page;
