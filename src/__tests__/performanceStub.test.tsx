/**
 * The performance analytics implementation lives in `seofields-pro`. This suite
 * pins the two contracts the free package still owes its consumers:
 *
 *  1. `createSeoPerformanceView` stays synchronous — Structure Builder calls it
 *     at config-build time, so returning a promise would break every consumer's
 *     `defaultDocumentNode`.
 *  2. A Studio without a resolvable pro package degrades to the upgrade card
 *     instead of throwing.
 *
 * The resolution branch is asserted on component identity rather than rendered
 * output: rendering `@sanity/ui` primitives needs the full Studio theme context
 * and proves nothing extra about which component was chosen.
 */
import {render, screen} from '@testing-library/react'

const config = {resolveUrl: () => 'https://example.com'}

describe('createSeoPerformanceView', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('returns a component synchronously, not a promise', async () => {
    jest.doMock('seofields-pro', () => ({}), {virtual: true})
    const {createSeoPerformanceView} = await import('../performanceStub')

    const View = createSeoPerformanceView(config)

    expect(typeof View).toBe('function')
    expect(View).not.toBeInstanceOf(Promise)
  })

  it('resolves to the pro view and forwards the whole config', async () => {
    const proView = () => <div>pro performance view</div>
    const createProView = jest.fn(() => proView)
    jest.doMock('seofields-pro', () => ({createSeoPerformanceView: createProView}), {virtual: true})

    const {resolvePerformanceView} = await import('../performanceStub')
    const resolved = await resolvePerformanceView(config)

    expect(resolved.default).toBe(proView)
    // The whole config must reach pro — it carries `resolveUrl`, without which
    // the view cannot map a document to a URL.
    expect(createProView).toHaveBeenCalledWith(config)
  })

  it('renders the resolved pro view through Suspense', async () => {
    const createProView = () => () => <div>pro performance view</div>
    jest.doMock('seofields-pro', () => ({createSeoPerformanceView: createProView}), {virtual: true})

    const {createSeoPerformanceView} = await import('../performanceStub')
    const View = createSeoPerformanceView(config)

    render(<View documentId="doc-1" schemaType="post" />)

    expect(await screen.findByText('pro performance view')).toBeInTheDocument()
  })

  it('falls back to the upgrade card when the pro package is missing', async () => {
    jest.doMock(
      'seofields-pro',
      () => {
        throw new Error('Cannot find module seofields-pro')
      },
      {virtual: true},
    )

    const {resolvePerformanceView, SeoPerformanceUpgradeCard} = await import('../performanceStub')

    await expect(resolvePerformanceView(config)).resolves.toEqual({
      default: SeoPerformanceUpgradeCard,
    })
  })

  it('falls back to the upgrade card when pro resolves without the export', async () => {
    // A stale seofields-pro (pre-1.4.0) resolves fine but has no view factory.
    jest.doMock('seofields-pro', () => ({someOtherExport: true}), {virtual: true})

    const {resolvePerformanceView, SeoPerformanceUpgradeCard} = await import('../performanceStub')

    await expect(resolvePerformanceView(config)).resolves.toEqual({
      default: SeoPerformanceUpgradeCard,
    })
  })
})
