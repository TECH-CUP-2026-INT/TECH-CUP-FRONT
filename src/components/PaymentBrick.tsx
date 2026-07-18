import { Payment, initMercadoPago } from '@mercadopago/sdk-react'
import { useTheme } from '@/configs/theme'

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-65a8a107-7cf6-4f28-ac1f-94960420a152'

initMercadoPago(MP_PUBLIC_KEY)

const SHARED_VARIABLES = {
  baseColor: '#F5A623',
  baseColorFirstVariant: '#6D28D9',
  errorColor: '#EF4444',
  successColor: '#22C55E',
  outlinePrimaryColor: '#F5A623',
  outlineSecondaryColor: '#6D28D9',
  fontSizeExtraSmall: '11px',
  fontSizeSmall: '12px',
  fontSizeMedium: '13px',
  fontSizeLarge: '15px',
  fontSizeExtraLarge: '17px',
  inputVerticalPadding: '10px',
  inputHorizontalPadding: '14px',
  inputBorderWidth: '1px',
  inputFocusedBorderWidth: '2px',
  borderRadiusSmall: '8px',
  borderRadiusMedium: '10px',
  borderRadiusLarge: '12px',
  borderRadiusFull: '999px',
  formPadding: '20px',
}

const DARK_VARIABLES = {
  ...SHARED_VARIABLES,
  textPrimaryColor: '#E5E7EB',
  textSecondaryColor: '#9B98A8',
  inputBackgroundColor: '#231440',
  formBackgroundColor: '#1A0D30',
  baseColorSecondVariant: '#231440',
}

const LIGHT_VARIABLES = {
  ...SHARED_VARIABLES,
  textPrimaryColor: '#1F1F1F',
  textSecondaryColor: '#374151',
  inputBackgroundColor: '#EAEAEA',
  formBackgroundColor: '#FFFFFF',
  baseColorSecondVariant: '#EDEAF7',
}

interface PaymentBrickProps {
  preferenceId: string
  amount: number
  onSubmit: () => Promise<void>
}

export function PaymentBrick({ preferenceId, amount, onSubmit }: PaymentBrickProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="w-full [&_iframe]:rounded-xl">
      {preferenceId ? (
        <Payment
          initialization={{ amount, preferenceId }}
          customization={{
            paymentMethods: {
              ticket: 'all',
              bankTransfer: 'all',
              creditCard: 'all',
              debitCard: 'all',
              prepaidCard: 'all',
              mercadoPago: 'all',
            } as const,
            visual: {
              style: {
                theme: isDark ? 'dark' : 'default',
                customVariables: isDark ? DARK_VARIABLES : LIGHT_VARIABLES,
              },
              hideFormTitle: false,
              hideValueProp: true,
            },
          } as any}
          onSubmit={onSubmit}
        />
      ) : (
        <div className="p-10 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-gold/30 border-t-gold mx-auto animate-spin mb-4" />
          <p className="text-sm text-text-muted">Cargando medios de pago...</p>
        </div>
      )}
    </div>
  )
}
