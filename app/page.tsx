import LoginForm from "./components/LoginForm";

const sesion: boolean = false;

export default function Home() {
  return <>{!sesion && <LoginForm />}</>;
}
