import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DemoOne() {
  return (
    <>
      <div className="flex gap-4 flex-wrap items-center">
        <Avatar tooltip="@preetsuthar17">
          <AvatarImage
            src="https://github.com/preetsuthar17.png"
            alt="@preetsuthar17"
          />
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <Avatar tooltip="@fuma-nama">
          <AvatarImage src="https://github.com/fuma-nama.png" alt="@fuma-nama" />
          <AvatarFallback>FN</AvatarFallback>
        </Avatar>
        <Avatar tooltip="John Doe">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </>
  );
}

