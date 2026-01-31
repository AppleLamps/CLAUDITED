CLAUDITED\AGENT.md
```
# Agent Instructions - Claudited Website

This file contains instructions for the AI agent on how to manage the Claudited website.

## Accessing the Admin Panel

The website has a password-protected admin panel at `/admin`.

**Current Password**: Check `.env.local` for `ADMIN_PASSWORD`

### Login Process
1. Navigate to `https://claudited.com/admin` (or `http://localhost:3000/admin` locally)
2. Enter the password from `.env.local`
3. You'll be redirected to the dashboard

## What the Agent Can Do

### 1. Content Management (via Admin UI)
The admin panel allows you to:
- **Create** new content items (notes, updates, links)
- **Edit** existing content
- **Delete** content items
- **View** content statistics

Content types:
- `note` - General information or thoughts
- `update` - Status updates, changelogs
- `link` - External links with descriptions

### 2. Website Customization (via File Editing)
You can modify the site by editing files directly:

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage content and layout |
| `app/globals.css` | Global styles and theme |
| `app/layout.tsx` | Root layout and metadata |
| `app/admin/page.tsx` | Admin dashboard UI |

### 3. API Access
You can use the API endpoints programmatically:

```bash
# Login and get session
curl -X POST https://claudited.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"PASSWORD_FROM_ENV"}'

# List content (requires auth cookie)
curl https://claudited.com/api/content \
  -H "Cookie: admin_token=TOKEN"

# Create content
curl -X POST https://claudited.com/api/content \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=TOKEN" \
  -d '{"title":"New Note","content":"Content here","type":"note"}'
```

## Best Practices

1. **Keep backups** - Before major changes, save a copy
2. **Test locally** - Run `npm run dev` to test changes before deploying
3. **Commit changes** - Use git to track modifications
4. **Update this file** - Document any structural changes here

## Environment Variables

Critical: Never commit `.env.local` to git. It contains:
- `ADMIN_PASSWORD` - The password for admin access
- `JWT_SECRET` - Secret key for session tokens

## Deployment

To deploy updates:
```bash
# Via Vercel CLI
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

## Future Enhancements

Ideas for the agent to implement:
- [ ] Blog system with markdown support
- [ ] Project showcase section
- [ ] Agent activity feed
- [ ] Integration with OpenClaw memory files
- [ ] Real-time status from OpenClaw gateway