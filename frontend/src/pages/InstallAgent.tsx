import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Terminal, Copy, Check, Monitor, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const installSteps = [
  {
    title: "Download the Agent",
    description: "Choose the appropriate agent for your operating system.",
    content: (
      <div className="grid sm:grid-cols-2 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Monitor className="w-6 h-6" />
          <span className="font-medium">Linux Agent</span>
          <span className="text-xs text-muted-foreground">x64, ARM64</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Server className="w-6 h-6" />
          <span className="font-medium">Windows Agent</span>
          <span className="text-xs text-muted-foreground">x64</span>
        </Button>
      </div>
    ),
  },
  {
    title: "Install the Agent",
    description: "Run the installation command on your system.",
    code: {
      linux: "curl -sSL https://securewatch.io/install.sh | sudo bash",
      windows: "powershell -Command \"irm https://securewatch.io/install.ps1 | iex\"",
    },
  },
  {
    title: "Configure with API Key",
    description: "Enter your API key to link the agent to your account.",
    code: {
      linux: "sudo securewatch config --token YOUR_API_KEY",
      windows: "securewatch.exe config --token YOUR_API_KEY",
    },
  },
  {
    title: "Start the Agent",
    description: "Start the agent to begin monitoring.",
    code: {
      linux: "sudo systemctl start securewatch",
      windows: "net start SecureWatchAgent",
    },
  },
];

export default function InstallAgent() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedOs, setSelectedOs] = useState<"linux" | "windows">("linux");
  const { toast } = useToast();

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Command has been copied.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Install Agent</h1>
          <p className="text-muted-foreground">
            Follow these steps to install and configure the SecureWatch agent.
          </p>
        </div>

        {/* OS Toggle */}
        <div className="flex gap-2 p-1 rounded-lg border border-border bg-secondary/30 w-fit">
          <Button
            variant={selectedOs === "linux" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedOs("linux")}
          >
            <Terminal className="w-4 h-4 mr-2" />
            Linux
          </Button>
          <Button
            variant={selectedOs === "windows" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedOs("windows")}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Windows
          </Button>
        </div>

        {/* Installation Steps */}
        <div className="space-y-4">
          {installSteps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {index + 1}
              </div>
              <CardHeader className="pl-20">
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="pl-20">
                {step.content}
                {step.code && (
                  <div className="relative group">
                    <pre className="p-4 rounded-lg bg-secondary/50 border border-border font-mono text-sm overflow-x-auto">
                      <code className="text-foreground">
                        {step.code[selectedOs]}
                      </code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(step.code![selectedOs], index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Key Input */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Your API Key</CardTitle>
            <CardDescription>
              If you've lost your API key, you can generate a new one from your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter your API key (e.g., sw_abc123...)"
                className="font-mono"
              />
              <Button variant="hero">
                Verify Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you encounter any issues during installation, check our{" "}
                  <a href="#" className="text-primary hover:underline">
                    documentation
                  </a>{" "}
                  or contact our{" "}
                  <a href="#" className="text-primary hover:underline">
                    support team
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
