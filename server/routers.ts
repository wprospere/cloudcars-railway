getDriverApplications: adminProcedure
  .input(
    z
      .object({
        limit: z.number().min(1).max(500).optional(),

        // ✅ Option A: Active vs Archived view
        view: z.enum(["active", "archived"]).optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    const rows: any[] = await getAllDriverApplications();

    const limit = input?.limit ?? 200;
    const view = input?.view ?? "active";

    // ✅ Option A logic:
    // Active  = everything except rejected
    // Archived = only rejected
    const filtered =
      view === "archived"
        ? rows.filter((r: any) => String(r.status ?? "") === "rejected")
        : rows.filter((r: any) => String(r.status ?? "") !== "rejected");

    return filtered.slice(0, limit).map((r: any) => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      licenseNumber: r.licenseNumber,
      yearsExperience: r.yearsExperience,
      vehicleOwner: r.vehicleOwner,
      availability: r.availability,
      message:
        typeof r.message === "string" ? r.message.slice(0, 5000) : r.message,
      status: r.status,
      assignedTo: r.assignedTo,

      assignedToEmail: r.assignedToEmail ?? null,
      assignedToAdminId: r.assignedToAdminId ?? null,
      lastTouchedAt: r.lastTouchedAt ?? null,
      lastTouchedByEmail: r.lastTouchedByEmail ?? null,

      internalNotes:
        typeof r.internalNotes === "string"
          ? r.internalNotes.slice(0, 5000)
          : r.internalNotes,
      createdAt: r.createdAt,

      documents: Array.isArray(r.documents) ? r.documents : [],
    }));
  }),
