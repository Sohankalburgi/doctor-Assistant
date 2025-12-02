# Testing Guide - Medicine Alternatives Integration

## ✅ Integration Checklist

### Frontend Components
- [x] `medicine-alternative.tsx` - Updated with chat interface and API integration
- [x] `chat-markdown.tsx` - Enhanced with table styling and custom components
- [x] Table rendering with markdown support
- [x] Loading states and error handling
- [x] Responsive design

### API Integration
- [x] `/api/medicine-recommendation` endpoint configured
- [x] Message format: `{ prompt: "medicine name" }`
- [x] Response format: `{ success: true, message: "markdown table" }`
- [x] Error handling implemented

### LLM Agent
- [x] Medicine recommendation agent configured
- [x] Tool integration for medicine search
- [x] Markdown table output format
- [x] System prompt optimized for table generation

---

## 🧪 How to Test

### 1. **Start the Development Server**
```bash
npm run dev
```
The app will run on `http://localhost:3000`

### 2. **Navigate to Medicine Alternatives**
- Go to the Dashboard
- Click "Medicine Alternatives" in the sidebar
- You should see a search interface

### 3. **Search for a Medicine**
Example searches:
- **Paracetamol** - Common pain reliever
- **Aspirin** - Anti-inflammatory
- **Ibuprofen** - Pain and fever management
- **Omeprazole** - Stomach acid reducer
- **Ciprofloxacin** - Antibiotic

### 4. **Expected Output Format**

The API should return markdown like this:

```markdown
## Medicine Alternatives

### Use Case
Paracetamol is used for pain relief and reducing fever. It's commonly used for headaches, body aches, and post-operative pain management.

### Available Alternatives

| Medicine Name | Company | Dosage | Quantity | Price Range | Rating | Side Effects |
|---|---|---|---|---|---|---|
| Paracetamol | Various Brands | 500mg | Strip of 10 | ₹20-50 | 4.5/5 | Nausea, Allergic reactions |
| Ibuprofen | Various Brands | 400mg | Strip of 10 | ₹30-70 | 4.3/5 | Stomach irritation, Dizziness |
| Aspirin | Various Brands | 500mg | Strip of 10 | ₹15-40 | 4.2/5 | Bleeding risk, GI upset |
| Diclofenac | Various Brands | 50mg | Strip of 10 | ₹25-60 | 4.4/5 | Stomach pain, Headache |
| Mefenamic Acid | Various Brands | 250mg | Strip of 10 | ₹20-50 | 4.1/5 | Nausea, Diarrhea |
```

---

## 🎯 Validation Points

### Visual Elements
- ✅ Search input field is visible and functional
- ✅ Search button works and triggers API call
- ✅ Loading spinner appears while processing
- ✅ Message appears on right side (user query)
- ✅ Response appears on left side (AI output)
- ✅ Table is properly formatted and readable
- ✅ Table has borders and styling
- ✅ Table header is highlighted
- ✅ Row hover effects work

### Functional Elements
- ✅ Can type in search field
- ✅ Submit button works
- ✅ Loading state prevents duplicate submissions
- ✅ API response is displayed
- ✅ Error messages are shown clearly
- ✅ Scroll to latest message works
- ✅ Multiple searches work sequentially

### Data Elements
- ✅ Medicine name displayed correctly
- ✅ Company names shown
- ✅ Dosage information visible
- ✅ Price ranges displayed
- ✅ Rating shown
- ✅ Side effects listed
- ✅ Use case explained

---

## 📊 Table Rendering Features

### Custom Styling Applied
```css
✅ Table borders: 1px solid
✅ Header background: secondary color
✅ Padding: 0.75rem per cell
✅ Row hover effect: background color change
✅ Alternating row colors for readability
✅ Responsive overflow with horizontal scroll
✅ Dark mode compatible
```

---

## 🐛 Troubleshooting

### Issue: Table Not Rendering
**Solution:**
- Ensure markdown uses `|` separators
- Check that response has proper table syntax
- Clear browser cache and reload

### Issue: API Returning Error
**Solution:**
- Check GROQ_API_KEY is set in environment
- Verify `/api/medicine-recommendation` route exists
- Check browser console for network errors
- Verify medicine name is valid

### Issue: Styling Not Applied
**Solution:**
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Clear browser cache and cookies
- Check if Tailwind CSS is initialized

### Issue: Slow Response
**Solution:**
- Medicine search tool makes external API call
- Average response: 2-5 seconds
- This is normal for LLM + tool integration
- Check internet connection

---

## 📱 Testing Across Devices

### Desktop (Chrome/Firefox/Safari)
- Table should display normally
- All styling visible
- Smooth animations

### Tablet
- Table may need horizontal scroll
- Touch interactions work
- Responsive design active

### Mobile
- Table with horizontal scroll
- Touch-friendly input and buttons
- Readable text size

---

## 🚀 Performance Metrics

**Expected Performance:**
- Page load: < 1 second
- API response: 2-5 seconds (includes tool call)
- Table rendering: < 100ms
- Scroll performance: 60fps

---

## 📝 Example Test Cases

### Test Case 1: Basic Search
```
Input: Paracetamol
Expected: Table with 5 alternatives
Result: ✅ PASS / ❌ FAIL
```

### Test Case 2: Multiple Searches
```
1. Search: Aspirin
2. Search: Ibuprofen
3. Search: Ciprofloxacin
Expected: All results displayed in conversation
Result: ✅ PASS / ❌ FAIL
```

### Test Case 3: Error Handling
```
Input: ""  (empty search)
Expected: No API call, input disabled
Result: ✅ PASS / ❌ FAIL
```

### Test Case 4: Responsive Design
```
Viewport: 375px (mobile)
Expected: Table scrollable, readable
Result: ✅ PASS / ❌ FAIL
```

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Verify all dependencies are installed
3. Check environment variables
4. Review API response format
5. Check network tab for API calls

---

## Summary of Integration

The medicine alternatives feature is **READY FOR TESTING** with:

✅ Fully functional search interface
✅ Real-time API integration
✅ Markdown table rendering
✅ Custom table styling
✅ Error handling and loading states
✅ Responsive mobile design
✅ Dark mode support
✅ Smooth scroll behavior

**Status: Implementation Complete** 🎉
