import { ConnectClient } from "../../../components/ConnectClient";

export default async function ConnectPage({ searchParams }: any) {
  const { token } = await searchParams;

  return (
    <>
      <ConnectClient token={token} />
    </>
  );
}
