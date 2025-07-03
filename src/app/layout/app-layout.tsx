import { ReactNode } from "react"
import { Toaster } from "sonner"
import { Footer } from "./footer"
import { Header } from "./header"
import { StatusBar } from "./status-bar"

/**
 * @purpose Defines the structure for the main layout components to maintain consistent page organization
 */
type MainLayoutProps = {
	header?: Parameters<typeof Header>[0]
	content?: ReactNode
	footer?: Parameters<typeof Footer>[0]
}

/**
 * @purpose Display main content with proper spacing and scrolling
 */
function Content({ content }: { content?: ReactNode }) {
	return (
		<main className="flex-grow overflow-y-auto overflow-x-hidden pb-20 pt-[108px] scrollbar-hide">
			{/* pt-[108px] = StatusBar(44px) + Header height(64px) */}
			{/* pb-20 to ensure content is visible above fixed footer */}
			<div className="container max-w-screen-sm mx-auto p-4 overflow-x-hidden">
				{content}
			</div>
		</main>
	)
}

/**
 * @purpose Provide consistent iOS-style layout with clean separation between components
 */
export function AppLayout({ header, content, footer }: MainLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col overflow-hidden">
			<StatusBar />
			<Toaster
				theme="dark"
				position="top-center"
				richColors
				className="!top-[50px]" // StatusBar(44px)
			/>
			{header && <Header {...header} />}
			<div className="flex-grow overflow-hidden">
				<Content content={content} />
				<div className="h-[120px]" aria-hidden="true" />
			</div>
			{footer && <Footer {...footer} />}
		</div>
	)
}
