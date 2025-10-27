# Counting Fun! - Tester Manual

## Welcome Testers! 👋

This guide will help you navigate and test all features of the Counting Fun! learning app.

---

## 🎮 Getting Started

### First Launch
- **No login required** - The app opens immediately for kids to start playing
- **Guest mode** - Full access to free features without creating an account
- **Optional account** - Sign up later in Parent Zone > Account tab for cloud sync

---

## 🧭 Main Navigation

### Top Bar
- **App Title** - "Counting Fun!" (top left)
- **Stars Display** - Shows total stars earned (⭐ counter)
- **Settings Icon** (⚙️) - Opens Parent Zone
- **Menu Icon** (☰) - Opens/closes activity menu

### Menu Panel (Left Side)
When open, displays:
1. **Activities** - Counting, Puzzles, Math
2. **Counting Modes** - Order, Challenge, Free Play
3. **Progress Bar** - Shows current level advancement
4. **Ask Parent Button** - Opens parental gate for help

---

## 🎯 Activities & Modes

### 🔢 Counting Activities
- **Count in Order** - Tap numbers sequentially (1, 2, 3...)
- **Number Challenge** - Find specific numbers called out
- **Free Play** - Explore numbers freely without rules

### 🧩 Puzzle Activities
- Solve shape and pattern puzzles
- Earn stars for completion

### ➕ Math Activities
- Simple addition and subtraction problems
- Age-appropriate difficulty

### 🔒 Premium Features
Features marked with a **lock icon** (🔒) require subscription:
- Advanced counting modes
- Extra puzzle types
- Premium math challenges

---

## 👨‍👩‍👧 Parent Zone

Access via **Settings icon** (⚙️) in top-right corner.

### Parent Gate
- Enter code: **5829** to access Parent Zone

### Available Tabs

#### 📋 My Child
- Update child's name, age, and avatar
- Set daily learning goals
- View profile summary

#### 📊 Progress
- Session history and statistics
- Total stars, puzzles solved, math problems completed
- Export progress data (JSON file)
- Charts showing learning trends

#### 👤 Account
**Without Account:**
- Play as guest (no data sync)
- Option to create account or sign in

**With Account:**
- Cloud sync across devices
- Data backup
- Progress preservation
- Sign out option

#### 👑 Subscription
- View current plan (Free/Premium)
- See premium features list
- Upgrade to premium (requires account)

#### ⚙️ Settings
- **Sound Effects** - Toggle on/off
- **Voice Guidance** - Toggle on/off
- **Voice Settings** - Adjust speed, pitch, volume
- **Time Limit** - Set daily play time (0 = unlimited)

#### 📚 Resources
- Learning tips for parents
- Help & support links
- Send feedback to developers

---

## 🎨 UI Elements Guide

### Visual Indicators
- **⭐ Stars** - Yellow badge showing total earned stars
- **🔒 Lock Icon** - Premium feature (requires subscription)
- **Progress Bar** - Green bar showing level completion
- **Level Display** - "Level X unlocked!" notifications

### Color Coding
- **Purple** - Primary actions and navigation
- **Yellow** - Stars and achievements
- **Pink/Purple Gradient** - Background theme
- **White Cards** - Content areas with shadows

### Interactive Elements
- **Large Colored Buttons** - Primary actions (tap numbers, solve puzzles)
- **Small Icon Buttons** - Navigation and settings
- **Modal Dialogs** - Success messages, celebrations, parent gate

---

## ✅ Testing Checklist

### Core Functionality
- [ ] App loads without requiring login
- [ ] Menu opens/closes smoothly
- [ ] All three activities accessible (Counting, Puzzles, Math)
- [ ] Counting modes switch correctly
- [ ] Stars increment on correct answers
- [ ] Progress bar advances with achievements

### Parent Zone
- [ ] Parent gate accepts code **5829**
- [ ] All tabs load without errors
- [ ] Profile updates save correctly
- [ ] Progress data displays accurately
- [ ] Settings changes take effect immediately

### Account Features
- [ ] Can play as guest
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Data syncs when logged in
- [ ] Sign out works properly

### Premium Features
- [ ] Premium features show lock icon
- [ ] Clicking locked feature shows upgrade modal
- [ ] Subscription tab displays correctly
- [ ] Upgrade flow initiates (if implemented)

### Responsive Design
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Works on desktop browsers
- [ ] Menu adapts to screen size
- [ ] All text is readable

### Performance
- [ ] App responds quickly to taps/clicks
- [ ] No lag when switching activities
- [ ] Animations run smoothly
- [ ] No console errors (check browser developer tools)

---

## 🐛 Reporting Issues

When reporting bugs, please include:
1. **Device type** - Phone/tablet/desktop, OS version
2. **Browser** - Chrome, Safari, Firefox, etc.
3. **Steps to reproduce** - What you did before the issue occurred
4. **Expected behavior** - What should have happened
5. **Actual behavior** - What actually happened
6. **Screenshots** - If applicable

---

## 💡 Testing Tips

1. **Test without account first** - Verify guest mode works fully
2. **Create test account** - Use a temporary email for testing sync
3. **Try premium features** - Check that lock/upgrade flow works
4. **Reset progress** - Use "Reset All Progress" in Parent Zone to test fresh start
5. **Export data** - Test the export feature in Progress tab
6. **Check persistence** - Close and reopen app to verify data saves
7. **Test parental gate** - Verify code **5829** works consistently

---

## 📞 Support

For questions or issues during testing:
- Use **Send Feedback** button in Parent Zone > Resources
- Check browser console for technical errors
- Document all findings for development team

---

**Happy Testing! 🎉**
