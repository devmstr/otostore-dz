import { ContentSection } from '../_components/content-section'
import { ZakatSettingsForm } from './_components/SettingsForm'

interface Props {}

const Page: React.FC<Props> = ({}: Props) => {
  return (
    <ContentSection
      title="Zakat Settings"
      desc="Configure your Zakat calculation preferences."
    >
      <ZakatSettingsForm
        initialSettings={{
          enabled: false,
          nisabCents: 1_615_000_00,
          rounding: 'nearest'
        }}
      />
    </ContentSection>
  )
}

export default Page
