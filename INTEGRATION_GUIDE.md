# Medicine Alternatives Integration Guide

## Overview
This document describes the integration of the medicine recommendation API with the frontend table rendering system.

## Architecture

### Components Involved

#### 1. **Medicine Alternatives Component** (`components/dashboard/medicine-alternative.tsx`)
- **Purpose**: Search interface for medicine alternatives
- **Features**:
  - Text input for medicine search
  - Real-time API communication
  - Chat-based interface for displaying results
  - **Full-width table output** for AI responses
  - Loading states and error handling
  - Responsive design

#### 2. **Chat Markdown Component** (`components/dashboard/chat-markdown.tsx`)
- **Purpose**: Render markdown output including tables
- **Features**:
  - Supports GitHub Flavored Markdown (GFM) tables
  - **Full-width table rendering** (100% of chat area)
  - Custom styling for table elements
  - Custom heading and list styling
  - Dark mode support
  - Horizontal scroll for large tables on mobile
  - Smooth hover effects on table rows

#### 3. **Medicine Recommendation API** (`app/api/medicine-recommendation/route.ts`)
- **Purpose**: Backend endpoint for medicine recommendations
- **Method**: POST
- **Request Body**:
  ```json
  {
    "prompt": "Paracetamol"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Markdown table with medicine alternatives"
  }
  ```

#### 4. **Medicine Agent** (`app/substitute-medicine/medicine.ts`)
- **Purpose**: LLM-powered agent for generating medicine recommendations
- **Features**:
  - Uses Groq's Llama model
  - Integrated medicine search tool
  - Returns structured table format
  - Provides use-case, alternatives, and pricing

## Data Flow

```
User Input (Medicine Name)
    ↓
MedicineAlternatives Component
    ↓
POST /api/medicine-recommendation
    ↓
medicineAgent.invoke()
    ↓
LLM Processing + Tool Integration
    ↓
Markdown Table Output
    ↓
ChatMarkdown Component
    ↓
Rendered HTML Table
```

## Table Format

The API returns markdown format similar to:

```markdown
## Paracetamol Alternatives

| Medicine Name | Company | Dosage | Quantity | Price Range | Rating | Side Effects |
|---|---|---|---|---|---|---|
| Paracetamol | Various | 500mg | Strip of 10 | ₹20-50 | 4.5/5 | Nausea, Headache |
| Ibuprofen | Various | 400mg | Strip of 10 | ₹30-60 | 4.3/5 | Stomach pain, Dizziness |
| Aspirin | Various | 500mg | Strip of 10 | ₹15-40 | 4.2/5 | Bleeding risk, GI issues |
```

## Key Features Implemented

### 1. **Real-time Search**
- Users can search for any medicine name
- API fetches alternatives dynamically
- Supports Indian medicine market

### 2. **Chat Interface**
- Messages displayed in conversation format
- User queries shown on the right
- AI responses shown on the left
- Loading indicator during processing

### 3. **Table Rendering**
- Markdown tables automatically converted to HTML
- Custom CSS styling for better UX
- Responsive design with horizontal scroll on mobile
- Hover effects on table rows
- Alternating row colors for readability

### 4. **Error Handling**
- Network errors are caught and displayed
- Invalid responses are shown to user
- Loading state prevents duplicate submissions

## CSS Styling Applied

Tables include:
- ✅ Header background styling
- ✅ Border styling consistent with theme
- ✅ Padding and spacing
- ✅ Row hover effects
- ✅ Alternating row backgrounds
- ✅ Responsive overflow handling
- ✅ Dark mode support via CSS variables

## Setup Requirements

### Dependencies Already Installed
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `@langchain/groq` - Groq API integration
- `@langchain/core` - LangChain core

### Environment Variables Required
```env
GROQ_API_KEY=your_groq_api_key_here
```

## Testing the Integration

### 1. **Manual Testing**
```bash
# Navigate to Medicine Alternatives tab in dashboard
# Search for a medicine (e.g., "Paracetamol")
# Wait for API response
# View rendered table with alternatives
```

### 2. **Expected Output**
- Medicine use-case explanation
- Table with 5 alternatives
- Company name, dosage, quantity, price, rating
- Side effects information

## Customization Guide

### Modify Table Styling
Edit the `components/dashboard/chat-markdown.tsx` file:

```tsx
<th className="px-4 py-2 text-left font-semibold text-foreground">
  // Customize header styling here
</th>
```

### Change API Endpoint
Update in `components/dashboard/medicine-alternative.tsx`:

```tsx
const response = await fetch("/api/medicine-recommendation", {
  // Change endpoint path here
})
```

### Update Prompt Instructions
Modify in `app/substitute-medicine/medicine.ts`:

```tsx
systemPrompt: `
// Customize AI instructions here
`
```

## Performance Considerations

1. **API Response Time**: Average 2-5 seconds
2. **Table Rendering**: Instant with scrolling for large tables
3. **Memory**: Efficient message state management
4. **Network**: Handles connection errors gracefully

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile Browsers: ✅ Responsive design

## Future Enhancements

1. **Caching**: Cache frequently searched medicines
2. **Filtering**: Add price range and availability filters
3. **Export**: Download table as CSV/PDF
4. **Comparison**: Side-by-side medicine comparison
5. **Reviews**: User ratings and reviews for alternatives
6. **Localization**: Support for multiple languages
7. **Real-time Pricing**: Update prices from 1mg API

## Troubleshooting

### Tables Not Rendering
- Check if `remark-gfm` is installed
- Verify markdown format includes `|` separators
- Check browser console for errors

### API Errors
- Verify `GROQ_API_KEY` is set correctly
- Check network tab in browser DevTools
- Ensure `/api/medicine-recommendation` route exists

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del)
- Check CSS variable names in theme
- Verify Tailwind CSS is configured

## Summary

The medicine alternatives feature is now fully integrated with:
- ✅ React-based search interface
- ✅ Real-time API integration
- ✅ Markdown table rendering
- ✅ Custom styling
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

Users can now search for medicines and view cost-effective alternatives in a beautifully rendered table format!
