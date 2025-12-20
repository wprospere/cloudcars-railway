import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Edit } from "lucide-react";

export default function TeamMembers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  const { data: members = [], refetch } = trpc.admin.getTeamMembers.useQuery();
  const createMember = trpc.admin.createTeamMember.useMutation();
  const updateMember = trpc.admin.updateTeamMember.useMutation();
  const deleteMember = trpc.admin.deleteTeamMember.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMember) {
        await updateMember.mutateAsync({
          id: editingMember.id,
          ...formData,
        });
        alert("Team member updated successfully!");
      } else {
        await createMember.mutateAsync(formData);
        alert("Team member added successfully!");
      }
      
      setDialogOpen(false);
      setEditingMember(null);
      setFormData({ name: "", email: "", role: "" });
      refetch();
    } catch (error) {
      alert("Failed to save team member");
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email || "",
      role: member.role || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      await deleteMember.mutateAsync({ id });
      alert("Team member removed successfully!");
      refetch();
    } catch (error) {
      alert("Failed to delete team member");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingMember(null);
    setFormData({ name: "", email: "", role: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-muted-foreground">
              Manage team members who can be assigned to inquiries
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMember(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@cloudcarsltd.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Driver Coordinator"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
                    {createMember.isPending || updateMember.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member: any) => (
            <Card key={member.id} className="p-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    {member.role && (
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {member.email && (
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                )}
              </div>
            </Card>
          ))}
          {members.length === 0 && (
            <Card className="p-12 col-span-full text-center text-muted-foreground">
              No team members yet. Click "Add Team Member" to get started.
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
