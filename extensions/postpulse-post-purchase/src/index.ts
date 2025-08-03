import {
  extend,
  Heading,
  TextBlock,
  BlockStack,
  Radio,
  Button,
} from '@shopify/post-purchase-ui-extensions'

extend('Checkout::PostPurchase::ShouldRender', () => {
  return { render: true }
})

// Post-purchase render entry
extend('Checkout::PostPurchase::Render', (root, api) => {
  let selected: string | null = null

  const stack = root.createComponent(BlockStack, { spacing: 'tight' }, [
    root.createComponent(Heading, undefined, 'Quick question'),
    root.createComponent(TextBlock, undefined, 'How did you hear about us?'),
    // Radios instead of ChoiceList/Choice
    root.createComponent(
      Radio,
      { id: 'search', name: 'hdyhau', checked: selected === 'search',
        onChange: (v: boolean) => { if (v) selected = 'search' } },
      'Search'
    ),
    root.createComponent(
      Radio,
      { id: 'instagram', name: 'hdyhau', checked: selected === 'instagram',
        onChange: (v: boolean) => { if (v) selected = 'instagram' } },
      'Instagram'
    ),
    root.createComponent(
      Radio,
      { id: 'tiktok', name: 'hdyhau', checked: selected === 'tiktok',
        onChange: (v: boolean) => { if (v) selected = 'tiktok' } },
      'TikTok'
    ),
    root.createComponent(
      Radio,
      { id: 'friend', name: 'hdyhau', checked: selected === 'friend',
        onChange: (v: boolean) => { if (v) selected = 'friend' } },
      'Friend/Referral'
    ),
    root.createComponent(
      Radio,
      { id: 'other', name: 'hdyhau', checked: selected === 'other',
        onChange: (v: boolean) => { if (v) selected = 'other' } },
      'Other'
    ),
    root.createComponent(Button, {
      onPress: async () => {
        try {
          await fetch(`${process.env.POSTPULSE_API_URL}/api/postpurchase/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              // Use inputData from the Post-purchase API
              shopDomain: api.inputData.shop.domain,
              // referenceId uniquely represents the purchase
              orderId: api.inputData.initialPurchase.referenceId,
              orderToken: api.inputData.initialPurchase.referenceId,
              isRepeat: null, // (optional for v1)
              hdyhau: selected,
            }),
          })
        } catch {
          // swallow errors; don't block buyer
        }
        // Tell Shopify you're done and move the buyer along
        await api.done()
      }
    }, 'Submit'),
  ])

  root.appendChild(stack)
})
