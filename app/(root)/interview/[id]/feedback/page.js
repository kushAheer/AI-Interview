
import React from 'react'
import Feedback from '@/components/Feedback'
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewDetails , getFeedbackByInterviewId } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';

async function page({ params }) {

  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewDetails(id);

  if (!interview) {
    redirect("/dashboard");
  }


  const feedback = await getFeedbackByInterviewId({ interviewId: id, userId: user.uid });

  return (
    <>
        <Feedback interviewId={id} feedback={feedback} />
    </>
  )
}

export default page