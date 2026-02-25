import { ConnectClient } from "../../../components/ConnectClient";

export default function ConnectPage({ searchParams }: any) {
  const token = searchParams.token;

  return (
    <>
      <ConnectClient token={token} />
    </>
  );
}
