import QuestionClient from "./QuestionClient";

export async function generateStaticParams() {
  return [];
}

export default function QuestionPage() {
  return <QuestionClient />;
}
