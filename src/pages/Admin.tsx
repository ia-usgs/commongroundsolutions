import { useEffect } from "react";
import { useAdminGuard } from "@/features/admin/hooks/useAdminGuard";
import { useAdminData } from "@/features/admin/hooks/useAdminData";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { ClassesManager } from "@/features/admin/components/ClassesManager";
import { SignupsManager } from "@/features/admin/components/SignupsManager";

const Admin = () => {
  const { ready } = useAdminGuard();
  const { classes, signups, refresh } = useAdminData(ready);

  useEffect(() => {
    document.title = "Admin Dashboard | Common Ground Solutions";
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8 space-y-10">
        <ClassesManager classes={classes} signups={signups} onChanged={refresh} />
        <SignupsManager signups={signups} classes={classes} onChanged={refresh} />
      </div>
    </div>
  );
};

export default Admin;
