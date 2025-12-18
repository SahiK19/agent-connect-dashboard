import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";

export default function ApiToken() {
  const [apiToken, setApiToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      const userData = JSON.parse(user);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/get-token.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userData.id })
        });

        const data = await response.json();
        
        if (response.ok) {
          setApiToken(data.api_token);
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch API token",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [navigate, toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiToken);
    toast({
      title: "Copied!",
      description: "API token copied to clipboard",
    });
  };

  const maskedToken = apiToken ? `${apiToken.slice(0, 8)}${"*".repeat(48)}${apiToken.slice(-8)}` : "";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">API Token</h1>
            <p className="text-muted-foreground mt-2">
              Your personal API token for agent authentication
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Your API Token
              </CardTitle>
              <CardDescription>
                Use this token to authenticate your agents. Keep it secure and never share it publicly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {showToken ? apiToken : maskedToken}
                  </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
