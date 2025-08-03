import {
  extend,
  View,
  Heading,
  TextBlock,
  Radio,
  TextField,
  Button,
  ButtonGroup,
  BlockStack,
} from '@shopify/post-purchase-ui-extensions'

// Always opt in to render (you can add rules later)
extend('Checkout::PostPurchase::ShouldRender', () => ({ render: true }))

extend('Checkout::PostPurchase::Render', (root, api) => {
  let selected: string | null = null
  let otherText = ''

  const labelFor = (id: string) =>
    id === 'friend' ? 'Friend/Referral' : id[0].toUpperCase() + id.slice(1)

  const optionIds = ['search', 'instagram', 'tiktok', 'friend', 'other'] as const
  const radios = optionIds.map((id) =>
    root.createComponent(
      Radio,
      {
        id,
        name: 'hdyhau',
        // Leave `checked` undefined so the component can manage its own visual state
        onChange: (v: boolean) => {
          if (v) selected = id
        },
      },
      labelFor(id),
    )
  )

  const otherField = root.createComponent(TextField, {
    label: 'Other (optional)',
    value: '',
    multiline: true,
    onChange: (val: string) => {
      otherText = val
    },
  })

  const submit = async () => {
    try {
      await fetch(`${process.env.POSTPULSE_API_URL}/api/postpurchase/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopDomain: api.inputData.shop?.domain ?? null,
          orderId: api.inputData.initialPurchase.referenceId,
          orderToken: api.inputData.initialPurchase.referenceId,
          hdyhau: selected,
          comment: selected === 'other' && otherText ? otherText : null,
        }),
      })
    } catch {
      // swallow errors; don't block the buyer
    }
    await api.done()
  }

  const submitBtn = root.createComponent(Button, { onPress: submit }, 'Submit')
  const skipBtn = root.createComponent(Button, { onPress: () => api.done() }, 'Skip for now')

  const content = root.createComponent(
    BlockStack,
    { spacing: 'loose' },
    [
      root.createComponent(Heading, undefined, 'Quick question'),
      root.createComponent(TextBlock, undefined, 'How did you hear about us?'),
      root.createComponent(BlockStack, { spacing: 'tight' }, radios),
      otherField,
      root.createComponent(ButtonGroup, undefined, [submitBtn, skipBtn]),
    ],
  )

  // Wrap in a View for subtle padding from the edges
  const framed = root.createComponent(
    View,
    // Keep props minimal to avoid type mismatches; defaults add comfortable padding in most themes
    undefined,
    content,
  )

  root.appendChild(framed)
})
