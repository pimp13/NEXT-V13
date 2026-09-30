import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Shield } from "lucide-react";
import Link from "next/link";

export default function PermissionsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Shield className="size-5" />

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Roles
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage roles and control what users can access.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/authorization/roles" className="underline">
                        <Button>Roles</Button>
                    </Link>
                    <Link href="/react-query-v2" className="underline">
                        <Button>Users</Button>
                    </Link>
                    <Button>
                        <Plus className="mr-2 size-4" />
                        Create Permission
                    </Button>
                </div>
            </div>


            <Card>
                <CardHeader>
                    <h1>hello world</h1>
                </CardHeader>
                <CardContent>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt voluptates ab omnis, necessitatibus aliquid ratione, molestiae quis itaque, voluptate minus nemo deserunt.</p>
                </CardContent>
            </Card>
        </div>
    )
}