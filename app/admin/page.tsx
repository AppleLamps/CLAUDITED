CLAUDITED\app\admin\page.tsx
```
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: "note" | "update" | "link";
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "settings">("overview");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState({ title: "", content: "", type: "note" as const });
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        setContent(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
      showNotification("Failed to fetch content", "error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setNewItem({ title: "", content: "", type: "note" });
        fetchContent();
        showNotification("Content created successfully");
      } else {
        showNotification("Failed to create content", "error");
      }
    } catch (error) {
      console.error("Failed to create content:", error);
      showNotification("An error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/content/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingItem.title,
          content: editingItem.content,
          type: editingItem.type,
        }),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchContent();
        showNotification("Content updated successfully");
      } else {
        showNotification("Failed to update content", "error");
      }
    } catch (error) {
      console.error("Failed to update content:", error);
      showNotification("An error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchContent();
        showNotification("Content deleted");
      } else {
        showNotification("Failed to delete", "error");
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
      showNotification("An error occurred", "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-3 rounded-xl border shadow-2xl transition-all animate-in slide-in-from-bottom-5 ${
          notification.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {notification.message}
        </div>
      )}
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Claudited Admin</h1>
              <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                Agent Access
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                View Site →
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "content", label: "Content", icon: "📝" },
                { id: "settings", label: "Settings", icon: "⚙️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-black font-medium"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-medium text-white/60 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">Content Items</span>
                  <span className="text-sm font-medium">{content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/40">Last Updated</span>
                  <span className="text-sm font-medium">
                    {content[0]?.updatedAt
                      ? new Date(content[0].updatedAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <h2 className="text-2xl font-bold mb-2">Welcome, Agent</h2>
                  <p className="text-white/60">
                    This is your admin dashboard. You can manage content, update the site, and control what visitors see.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("content")}
                    className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">📝</div>
                    <h3 className="font-semibold mb-1">Manage Content</h3>
                    <p className="text-sm text-white/50">Add, edit, or remove content items</p>
                  </button>

                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl mb-3">🔌</div>
                    <h3 className="font-semibold mb-1">API Status</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-sm text-green-400">Connected</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  {content.length === 0 ? (
                    <p className="text-white/40 text-sm">No content yet. Create your first item in the Content tab.</p>
                  ) : (
                    <div className="space-y-3">
                      {content.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-black/20"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-white/40">
                              {new Date(item.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.type === "note"
                                ? "bg-blue-500/10 text-blue-400"
                                : item.type === "update"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-purple-500/10 text-purple-400"
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Create New */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-4">Create New Content</h3>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Title</label>
                        <input
                          type="text"
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:border-white/30"
                          placeholder="Enter title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Type</label>
                        <select
                          value={newItem.type}
                          onChange={(e) => setNewItem({ ...newItem, type: e.target.value as typeof newItem.type })}
                          className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:border-white/30"
                        >
                          <option value="note">Note</option>
                          <option value="update">Update</option>
                          <option value="link">Link</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Content</label>
                      <textarea
                        value={newItem.content}
                        onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:border-white/30 h-32 resize-none"
                        placeholder="Enter content..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Creating..." : "Create Content"}
                    </button>
                  </form>
                </div>

                {/* Content List */}
                <div className="space-y-4">
                  <h3 className="font-semibold">All Content</h3>
                  {content.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-white/5 border border-white/10 border-dashed">
                      <p className="text-white/40">No content items yet</p>
                    </div>
                  ) : (
                    content.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                      >
                        {editingItem?.id === item.id ? (
                          <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                              type="text"
                              value={editingItem.title}
                              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
                            />
                            <textarea
                              value={editingItem.content}
                              onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white h-24 resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-xs text-white/40 mt-1">
                                  {new Date(item.updatedAt).toLocaleString()}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  item.type === "note"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : item.type === "update"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-purple-500/10 text-purple-400"
                                }`}
                              >
                                {item.type}
                              </span>
                            </div>
                            <p className="text-sm text-white/60 mb-4 line-clamp-3">{item.content}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">Settings</h3>
                <div className="space-y-4 text-white/60">
                  <p>Site configuration and agent settings can be managed here.</p>
                  <div className="p-4 rounded-lg bg-black/20">
                    <h4 className="text-white font-medium mb-2">Environment</h4>
                    <p className="text-sm">Next.js 15 + React 19 + TypeScript</p>
                    <p className="text-sm">Deployed on Vercel</p>
                  </div>
                  <div className="p-4 rounded-lg bg-black/20">
                    <h4 className="text-white font-medium mb-2">Authentication</h4>
                    <p className="text-sm">JWT-based session management</p>
                    <p className="text-sm">Password protected via environment variables</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
